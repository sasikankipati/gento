package com.sasi.gento.GPAPI;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages="com.sasi.gento")
public class GpApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(GpApiApplication.class, args);
	}

}
