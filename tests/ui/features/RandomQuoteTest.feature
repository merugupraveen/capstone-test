@ui @regression @randomQuote @EPMCDMETST-37399
Feature: Random Quote UI
  As a user
  I want to generate, copy, and browse random quotes
  So that I can discover and reuse quotes

  # NOTE:
  # Locators and AUT URL are unknown in this repo; scenarios are written against placeholders.
  # Update env.uiBaseUrl to point to the Random Quote page, and update selectors in RandomQuotePage.

  @smoke @TC01
  Scenario: Page load shows a quote
    Given I open the Random Quote page
    Then I should see a quote displayed
    And the quote should have an accessible name "Quote"
    And I should see the quote author

  @regression @TC05
  Scenario: Generate new quote via button click
    Given I open the Random Quote page
    And I capture the current quote
    When I click the Generate quote button
    Then I should see the quote loading state
    And I should see a new quote displayed

  @regression @TC06
  Scenario: Generate new quote via keyboard (Enter)
    Given I open the Random Quote page
    And I focus the Generate quote button
    And I capture the current quote
    When I press Enter
    Then I should see a new quote displayed

  @regression @TC09
  Scenario: Copy quote to clipboard (success)
    Given I open the Random Quote page
    And a quote is displayed
    When I click the Copy button
    Then the clipboard should contain the current quote and author
    And I should see a copy confirmation message

  @regression @TC11
  Scenario: Open History panel
    Given I open the Random Quote page
    And I have generated 3 quotes
    When I open the History panel
    Then I should see at least 3 quotes in History

  @regression @TC12
  Scenario: Select a quote from History re-displays it
    Given I open the Random Quote page
    And I have generated 3 quotes
    And I open the History panel
    When I select the first quote in History
    Then I should see the selected History quote displayed

  @regression @TC14
  Scenario: Filter by category affects generation
    Given I open the Random Quote page
    When I select category "Inspiration"
    And I click the Generate quote button
    Then I should see a quote displayed for category "Inspiration"

  @regression @TC17
  Scenario: API failure shows error and Retry
    Given I open the Random Quote page
    When the quote generation request fails
    Then I should see an error message "Couldn’t load a new quote"
    And I should see a Retry button
