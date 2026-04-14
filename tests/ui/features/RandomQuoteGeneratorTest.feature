@ui @market_analysis @done_market_analysis @EPMCDMETST-38844
Feature: Random Quote Generator (market analysis)
  # Note: This feature file is derived strictly from the Jira story EPMCDMETST-38844 inputs.
  # The competitor page behavior and AUT selectors are not verified in this repository context.

  @EPMCDMETST-38844 @TC-38844-001
  Scenario: Generate a new random quote
    Given I am on the Random Quote Generator page
    When I trigger the random quote generation action
    Then I should see a quote displayed

  @EPMCDMETST-38844 @TC-38844-002
  Scenario: Display author attribution for a generated quote when available
    Given a quote has been generated
    Then I should see the quote author attribution if available
