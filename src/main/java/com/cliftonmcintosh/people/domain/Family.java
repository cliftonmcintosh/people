package com.cliftonmcintosh.people.domain;

import javax.persistence.*;
import java.util.List;

/**
 * Created by cmcintosh on 9/26/15.
 */
@Entity
public class Family {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @OneToMany(mappedBy = "family", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Person> people;

    public long getId() {
        return id;
    }

    public List<Person> getPeople() {
        return people;
    }

    public void setPeople(List<Person> people) {
        this.people = people;
    }
}
