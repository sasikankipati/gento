package com.sasi.gento.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.sasi.gento.VariablesVO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@Slf4j
public class AutoGenController {

    @Value("${base.path}")
    private String basePath;
    @Value("${required_providers.aws.source}")
    private String providerAwsSource;

    @Value("${required_providers.aws.version}")
    private String providerAwsVersion;

    List<String> filesListInDir = new ArrayList<>();
    ArrayList<VariablesVO> arlVariableVO = new ArrayList<VariablesVO>();

    @PostMapping(value = "/api/gencode", produces = "application/json")
    public ResponseEntity<Resource> processAutoGenerateTCode(@RequestBody com.fasterxml.jackson.databind.JsonNode payload) {
        HttpHeaders headers = new HttpHeaders();
        try {
            System.out.println(">>>>>>>>>>>>>>Event from BB >>>>>>>>>>>>>>" + payload.toPrettyString());
            String applicationName = payload.get("application_name").asText();
            Path pathAccount = Paths.get(basePath + File.separator+"data"+File.separator+applicationName+File.separator+"account");
            Path pathAccountRes = Paths.get(basePath + File.separator+"data"+File.separator+applicationName+File.separator+"accountResources");
            Files.createDirectories(pathAccount);
            Files.createDirectories(pathAccountRes);

            createMainTF(pathAccount);
            accountCreation(pathAccount,payload);

            createMainTF(pathAccountRes);
            createVPC(pathAccountRes,payload);


            File dir = new File(basePath + File.separator+"data"+File.separator+applicationName);
            zipDirectory(dir,basePath + File.separator+"data"+File.separator+applicationName+".zip");
            File file = new File(basePath + File.separator+"data"+File.separator+applicationName+".zip");
            InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename="+applicationName+".zip");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(file.length())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        }catch (IOException e) {
            throw new RuntimeException(e);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }

    private void addVariable(String name,String description,String defaultVal){
        name = name.replaceAll(" ","_");
        VariablesVO objVariablesVO = new VariablesVO();
        objVariablesVO.setName(name);
        objVariablesVO.setDescription(description);
        objVariablesVO.setDefaultVal(defaultVal);
        arlVariableVO.add(objVariablesVO);
    }

    private void generateVariable(Path pathAccountRes) {
        StringBuffer strBuffer = new StringBuffer();
        arlVariableVO.forEach(objVariablesVO -> {
            strBuffer.append("variable \""+objVariablesVO.getName()+"\" {\n" +
                    "  default = \""+objVariablesVO.getDefaultVal()+"\"\n" +
                    "  description = \""+objVariablesVO.getDescription()+"\"\n" +
                    "}\n");
        });
        System.out.println(strBuffer.toString());
        writeAFile(pathAccountRes,"variables.tf",strBuffer.toString());
    }

    private void writeAFile(Path pathAccountRes,String path,String content){
        try{
            Path pathToFile = pathAccountRes.resolve(path);
            BufferedWriter writer = Files.newBufferedWriter(pathToFile);
            writer.write(content);
            writer.close();
        }catch (IOException e){
            throw new RuntimeException(e);
        }
    }

    private void createVPC(Path pathAccountRes, JsonNode payload) {
        try {
            String applicationName = payload.get("application_name").asText();
            Iterator<JsonNode> itrRegion = payload.get("children").iterator();
            while(itrRegion.hasNext()){
                JsonNode childNode = itrRegion.next();
                addVariable(childNode.get("name").asText(),applicationName+"_"+childNode.get("name").asText(),childNode.get("region").asText());


                Iterator<JsonNode> itrVPC = childNode.get("children").iterator();
                while(itrVPC.hasNext()){
                    JsonNode vpcNode = itrVPC.next();
                    if(vpcNode.get("category").asText().equals("vpc")){
                        String vpcName = applicationName+"_"+vpcNode.get("name").asText();
                        vpcName = vpcName.replaceAll(" ","_");
                        addVariable(vpcName+"_cidr",vpcName+"_cidr",vpcNode.get("cidr").asText());

                        String str = "resource \"aws_vpc\" \""+vpcName+"\" {\n" +
                                "  cidr_block = \"${var."+vpcName+"_cidr"+"}\"\n" +
                                "  tags = {\n" +
                                "    Name = \"test-vpc\"\n" +
                                "  }\n" +
                                "}";
                        writeAFile(pathAccountRes,vpcName+".tf",str);

                        Iterator<JsonNode> itrSubnets = vpcNode.get("children").iterator();
                        while(itrSubnets.hasNext()) {
                            JsonNode subnetNode = itrSubnets.next();
                            if(subnetNode.get("category").asText().equals("subnet")){

                                String subnetName = applicationName+"_"+vpcNode.get("name").asText()+"_"+subnetNode.get("name").asText()+"_"+subnetNode.get("type").asText();
                                System.out.println("subnetName >>> "+subnetName);
                                subnetName = subnetName.replaceAll(" ","_");
                                System.out.println("subnetName >>> "+subnetName);
                                addVariable(subnetName+"_cidr",subnetName+"_cidr",subnetNode.get("cidr").asText());
                                addVariable(subnetName+"_zonenames",subnetName+"_zonenames",subnetNode.get("zonenames").asText());

                                String subnetName_str = "resource \"aws_subnet\" \""+subnetName+"\" {\n" +
                                        "  vpc_id = \"${aws_vpc."+vpcName+".id}\"\n" +
                                        "  cidr_block = \"${var."+subnetName+"_cidr"+"}\"\n" +
                                        "  availability_zone = \"${var."+subnetName+"_zonenames"+"}\"\n" +
                                        "  tags = {\n" +
                                        "    Name = \""+subnetName+"\"\n" +
                                        "  }\n" +
                                        "}\n";

                                writeAFile(pathAccountRes,subnetName+".tf",subnetName_str);

                                Iterator<JsonNode> itrEc2 = subnetNode.get("children").iterator();
                                while(itrEc2.hasNext()) {

                                    JsonNode ec2Node = itrEc2.next();
                                    if(ec2Node.get("category").asText().equals("ec2")){

                                        String ec2Name = subnetName+"_"+ec2Node.get("name").asText();
                                        ec2Name = ec2Name.replaceAll(" ","_");
                                        addVariable(ec2Name+"_ami",ec2Name+"_ami",ec2Node.get("ami").asText());
                                        addVariable(ec2Name+"_instance_type",ec2Name+"_instance_type",ec2Node.get("instance_type").asText());

                                        String ec2_str = "resource \"aws_instance\" \""+ec2Name+"\" {\n" +
                                                "   ami  = \"${var."+ec2Name+"_ami"+"}\"\n" +
                                                "   instance_type = \""+ec2Name+"_instance_type"+"\"\n" +
                                                "   subnet_id = \"${aws_subnet."+subnetName+".id}\"\n" +
                                                "  tags = {\n" +
                                                "    Name = \""+ec2Name+"\"\n" +
                                                "  }\n" +
                                                "}";

                                        writeAFile(pathAccountRes,ec2Name+".tf",ec2_str);
                                    }
                                }

                                if(subnetNode.get("type").asText().equals("private")){

                                }else if(subnetNode.get("type").asText().equals("public")){

                                }
                            }
                        }
                    }
                }
            }

            generateVariable(pathAccountRes);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    private void createMainTF(Path folderPath){
        try {
            Path pathToFile = folderPath.resolve("main.tf");
            BufferedWriter writer = Files.newBufferedWriter(pathToFile);
            String str = "terraform {\n" +
                    "  required_providers {\n" +
                    "    aws = {\n" +
                    "        source = "+providerAwsSource+"\n" +
                    "        version = "+providerAwsVersion+"\n" +
                    "    }\n" +
                    "  }\n" +
                    "}";
            writer.write(str);
            writer.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void accountCreation(Path folderPath,com.fasterxml.jackson.databind.JsonNode payload){
        try{

            String applicationName = payload.get("application_name").asText();
            String environment = payload.get("environment").asText();
            String email = payload.get("app_team_emailId").asText();

            Path pathToFile = folderPath.resolve("account.tf");
            BufferedWriter writer = Files.newBufferedWriter(pathToFile);
            String str = "\n" +
                    "data \"aws_organizations_organization\" \"root\" {}\n" +
                    "\n" +
                    "resource \"aws_organizations_organizational_unit\" \""+applicationName+"\" {\n" +
                    "  name      = \""+applicationName+"\"\n" +
                    "  parent_id = data.aws_organizations_organization.root.id\n" +
                    "}\n" +
                    "\n" +
                    "resource \"aws_organizations_account\" \""+applicationName+"_"+environment+"\" {\n" +
                    "  name  = \""+applicationName+"_"+environment+"\"\n" +
                    "  email = \""+email+"\"\n" +
                    "  parent_id = aws_organizations_organizational_unit."+applicationName+".id\n" +
                    "}\n" +
                    "\n" +
                    "output \""+applicationName+"_"+environment+"_account_id\" {\n" +
                    "    value = aws_organizations_account."+applicationName+"_"+environment+".id\n" +
                    "}\n" +
                    "\n" +
                    "output \""+applicationName+"_"+environment+"_account_arn\" {\n" +
                    "  value = aws_organizations_account."+applicationName+"_"+environment+".arn \n" +
                    "}";
            writer.write(str);
            writer.close();
        }catch (IOException e){
            throw new RuntimeException(e);
        }

    }

    private void zipDirectory(File dir, String zipDirName) {
        try {
            filesListInDir = new ArrayList<>();
            populateFilesList(dir);
            //now zip files one by one
            //create ZipOutputStream to write to the zip file
            FileOutputStream fos = new FileOutputStream(zipDirName);
            ZipOutputStream zos = new ZipOutputStream(fos);
            for(String filePath : filesListInDir){
                System.out.println("Zipping "+filePath);
                //for ZipEntry we need to keep only relative file path, so we used substring on absolute path
                ZipEntry ze = new ZipEntry(filePath.substring(dir.getAbsolutePath().length()+1, filePath.length()));
                zos.putNextEntry(ze);
                //read the file and write to ZipOutputStream
                FileInputStream fis = new FileInputStream(filePath);
                byte[] buffer = new byte[1024];
                int len;
                while ((len = fis.read(buffer)) > 0) {
                    zos.write(buffer, 0, len);
                }
                zos.closeEntry();
                fis.close();
            }
            zos.close();
            fos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void populateFilesList(File dir) throws IOException {
        File[] files = dir.listFiles();
        for(File file : files){
            if(file.isFile()) filesListInDir.add(file.getAbsolutePath());
            else populateFilesList(file);
        }
    }


}
