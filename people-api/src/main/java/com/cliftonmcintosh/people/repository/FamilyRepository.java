package com.cliftonmcintosh.people.repository;

import com.cliftonmcintosh.people.domain.Family;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

/**
 * Created by cmcintosh on 9/26/15.
 */
@RepositoryRestResource(collectionResourceRel = "families", path = "families")
public interface FamilyRepository extends CrudRepository<Family, Long> {

    List<Family> findByPeopleLastName(@Param("lastName") String lastName);

    List<Family> findByPeopleFirstName(@Param("firstName") String firstName);

    List<Family> findByPeopleFirstNameAndPeopleLastName(@Param("firstName") String firstName, @Param("lastName") String lastName);
}
