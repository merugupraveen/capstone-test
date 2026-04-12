@ui @smoke @regression
Feature: Example domain UI validation

  Scenario: User sees Example Domain heading
    Given I open the example home page
    Then I should see the expected heading
