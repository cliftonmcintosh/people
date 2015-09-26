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
        Assert.assertTrue("The last name of the people found should match the one used for searching", lastNameMatches(allFeldmans, FELDMAN));

        List<Person> allFeldmanns = repository.findByLastName(FELDMANN);
        Assert.assertEquals("There should be one person with the last name \"Feldmann\"", 1, allFeldmanns.size());
        Assert.assertTrue("The last name of the people found should match the one used for searching", lastNameMatches(allFeldmanns, FELDMANN));
    }

    @Test
    public void testFindPersonByFirstNameShouldFindAllPeopleWhoseFirstNameMatches() {
        saveThree();

        List<Person> allPersons = (List<Person>) repository.findAll();
        Assert.assertEquals("There should be three people whose records have been saved", 3, allPersons.size());

        List<Person> allJoes = repository.findByFirstName(JOE);
        Assert.assertEquals("There should be two people with the first name \"Joe\"", 2, allJoes.size());
        Assert.assertTrue("The first name of the people found should match the one used for searching", firstNameMatches(allJoes, JOE));

        List<Person> allJosephs = repository.findByFirstName(JOSEPH);
        Assert.assertEquals("There should be one person with the first name \"Joseph\"", 1, allJosephs.size());
        Assert.assertTrue("The first name of the people found should match the one used for searching" ,firstNameMatches(allJosephs, JOSEPH));
    }

    @Test
    public void testFindPersonByFirstNameAndLastNameShouldFindAllPeopleWhoseFirstNameAndLastNameMatches() {
        saveThree();

        List<Person> allPersons = (List<Person>) repository.findAll();
        Assert.assertEquals("There should be three people whose records have been saved", 3, allPersons.size());

        List<Person> allJosephFeldmans = repository.findByFirstNameAndLastName(JOSEPH, FELDMAN);
        Assert.assertEquals("There should be one person named \"Joseph Feldman\"", 1, allJosephFeldmans.size());
        Assert.assertTrue("The first and last names should match the ones used for searching", firstAndLastNameMatch(allJosephFeldmans, JOSEPH, FELDMAN));

        List<Person> allJoeFeldmans = repository.findByFirstNameAndLastName(JOE, FELDMAN);
        Assert.assertEquals("There should be one person named \"Joe Feldman\"", 1, allJoeFeldmans.size());
        Assert.assertTrue("The first and last names should match the ones used for searching", firstAndLastNameMatch(allJoeFeldmans, JOE, FELDMAN));

        List<Person> allJoeFeldmanns = repository.findByFirstNameAndLastName(JOE, FELDMANN);
        Assert.assertEquals("There should be one person named \"Joe Feldmann\"", 1, allJoeFeldmanns.size());
        Assert.assertTrue("The first and last names should match the ones used for searching", firstAndLastNameMatch(allJoeFeldmanns, JOE, FELDMANN));
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

    private boolean lastNameMatches(List<Person> people, String expectedLastName) {
        return people.stream().allMatch(person -> expectedLastName.equals(person.getLastName()));
    }

    private boolean firstNameMatches(List<Person> people, String expectedFirstName) {
        return people.stream().allMatch(person -> expectedFirstName.equals(person.getFirstName()));
    }

    private boolean firstAndLastNameMatch(List<Person> people, String expectedFirstName, String expectedLastName) {
        return people.stream().allMatch(person -> expectedFirstName.equals(person.getFirstName()) && expectedLastName.equals(person.getLastName()));
    }
}
