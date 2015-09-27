package com.cliftonmcintosh.people.configuration;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.orm.jpa.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Created by cmcintosh on 9/26/15.
 */
@Configuration
@EnableAutoConfiguration
@EntityScan(basePackages = "com.cliftonmcintosh")
@EnableJpaRepositories(basePackages ="com.cliftonmcintosh")
@EnableTransactionManagement
public class RepositoryConfiguration {
}
