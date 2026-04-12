@api @smoke @regression
Feature: Sample API contract validation

  Scenario: User fetches a known post
    Given I send a GET request to "/posts/1"
    Then the response status should be 200
    And the response should contain id 1
    And the response should match the post schema
