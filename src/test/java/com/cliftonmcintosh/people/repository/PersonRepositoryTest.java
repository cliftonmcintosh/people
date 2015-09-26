package com.cliftonmcintosh.people.repository;

import com.cliftonmcintosh.people.configuration.RepositoryConfiguration;
import com.cliftonmcintosh.people.domain.Person;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

/**
 * Created by cmcintosh on 9/26/15.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = {RepositoryConfiguration.class})
public class PersonRepositoryTest {


    public static final String JOSEPH = "Joseph";
    public static final String FELDMAN = "Feldman";
    public static final String JOE = "Joe";
    public static final String FELDMANN = "Feldmann";
    private PersonRepository repository;

    @Autowired
    public void setPersonRepository(PersonRepository repository) {
        this.repository = repository;
    }

    @After
    public void tearDown() {
        repository.deleteAll();
    }

    @Test
    public void testSavePerson() {
        Person person = saveJosephFeldman();

        Person foundPerson = repository.findOne(person.getId());
        Assert.assertNotNull("There should be a person found for the id for the person that was saved", foundPerson);

        List<Person> allPersons = (List<Person>) repository.findAll();
        Assert.assertEquals("There should be one person found", 1, allPersons.size());
        Assert.assertTrue(allPersons.stream().allMatch(thePerson -> JOSEPH.equals(thePerson.getFirstName())));
        Assert.assertTrue(allPersons.stream().allMatch(thePerson -> FELDMAN.equals(thePerson.getLastName())));
    }

    @Test
    public void testFindPersonByLastNameShouldFindAllPeopleWhoseLastNameMatches() {
        saveThree();

        List<Person> allPersons = (List<Person>) repository.findAll();
        Assert.assertEquals("There should be three people whose records have been saved", 3, allPersons.size());

        List<Person> allFeldmans = repository.findByLastName(FELDMAN);
        Assert.assertEquals("There should be two people with the last name \"Feldman\"", 2, allFeldmans.size());
        Assert.assertTrue(allFeldmans.stream().allMatch(thePerson -> FELDMAN.equals(thePerson.getLastName())));

        List<Person> allFeldmanns = repository.findByLastName(FELDMANN);
        Assert.assertEquals("There should be one person with the last name \"Feldmann\"", 1, allFeldmanns.size());
        Assert.assertTrue(allFeldmanns.stream().allMatch(thePerson -> FELDMANN.equals(thePerson.getLastName())));
    }

    @Test
    public void testFindPersonByFirstNameShouldFindAllPeopleWhoseFirstNameMatches() {
        saveThree();

        List<Person> allPersons = (List<Person>) repository.findAll();
        Assert.assertEquals("There should be three people whose records have been saved", 3, allPersons.size());

        List<Person> allJoes = repository.findByFirstName(JOE);
        Assert.assertEquals("There should be two people with the first name \"Joe\"", 2, allJoes.size());
        Assert.assertTrue(allJoes.stream().allMatch(thePerson -> JOE.equals(thePerson.getFirstName())));

        List<Person> allJosephs = repository.findByFirstName(JOSEPH);
        Assert.assertEquals("There should be one person with the first name \"Joseph\"", 1, allJosephs.size());
        Assert.assertTrue(allJosephs.stream().allMatch(thePerson -> JOSEPH.equals(thePerson.getFirstName())));
    }

    @Test
    public void testFindPersonByFirstNameAndLastNameShouldFindAllPeopleWhoseFirstNameAndLastNameMatches() {
        saveThree();

        List<Person> allPersons = (List<Person>) repository.findAll();
        Assert.assertEquals("There should be three people whose records have been saved", 3, allPersons.size());

        List<Person> allJosephFeldmans = repository.findByFirstNameAndLastName(JOSEPH, FELDMAN);
        Assert.assertEquals("There should be one person named \"Joseph Feldman\"", 1, allJosephFeldmans.size());
        Assert.assertTrue(allJosephFeldmans.stream().allMatch(thePerson -> JOSEPH.equals(thePerson.getFirstName()) && FELDMAN.equals(thePerson.getLastName())));

        List<Person> allJoeFeldmans = repository.findByFirstNameAndLastName(JOE, FELDMAN);
        Assert.assertEquals("There should be one person named \"Joe Feldman\"", 1, allJoeFeldmans.size());
        Assert.assertTrue(allJoeFeldmans.stream().allMatch(thePerson -> JOE.equals(thePerson.getFirstName()) && FELDMAN.equals(thePerson.getLastName())));

        List<Person> allJoeFeldmanns = repository.findByFirstNameAndLastName(JOE, FELDMANN);
        Assert.assertEquals("There should be one person named \"Joe Feldmann\"", 1, allJoeFeldmanns.size());
        Assert.assertTrue(allJoeFeldmanns.stream().allMatch(thePerson -> JOE.equals(thePerson.getFirstName()) && FELDMANN.equals(thePerson.getLastName())));
    }

    private Person saveJosephFeldman() {
        Person josephFeldman = new Person();
        josephFeldman.setFirstName(JOSEPH);
        josephFeldman.setLastName(FELDMAN);

        repository.save(josephFeldman);
        return josephFeldman;
    }

    private void saveThree() {

        saveJosephFeldman();

        Person joeFeldman = new Person();
        joeFeldman.setFirstName(JOE);
        joeFeldman.setLastName(FELDMAN);

        repository.save(joeFeldman);

        Person joeFeldmann = new Person();
        joeFeldmann.setFirstName(JOE);
        joeFeldmann.setLastName(FELDMANN);

        repository.save(joeFeldmann);
    }
}
