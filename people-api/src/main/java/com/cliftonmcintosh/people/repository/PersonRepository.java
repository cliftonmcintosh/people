package com.cliftonmcintosh.people.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.cliftonmcintosh.people.domain.Person;

import java.util.List;

/**
 * Created by cmcintosh on 9/26/15.
 */
@RepositoryRestResource(collectionResourceRel = "people", path = "people")
public interface PersonRepository extends CrudRepository<Person, Long> {

    List<Person> findByFirstName(@Param("firstName") String firstName);

    List<Person> findByLastName(@Param("lastName") String lastName);

    List<Person> findByFirstNameAndLastName(@Param("firstName") String firstName, @Param("lastName") String lastName);
}
