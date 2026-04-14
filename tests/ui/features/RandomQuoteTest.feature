@ui @randomQuote @regression @EPMCDMETST-38909
Feature: Random Quote - UI behaviors
  As a user
  I want to generate and interact with random quotes
  So that I can read, copy, and share inspirational quotes

  @EPMCDMETST-38908-TC01
  Scenario: Show Quote button is visible on main screen load
    Given I open the application main screen
    Then I should see the "Show Quote" button

  @EPMCDMETST-38908-TC02
  Scenario: Clicking Show Quote displays a quote text
    Given I open the application main screen
    When I click the "Show Quote" button
    Then I should see a non-empty quote text

  @EPMCDMETST-38908-TC03
  Scenario: Loading indicator is displayed while quote is being retrieved
    Given I open the application main screen
    When I click the "Show Quote" button
    Then I should see a loading indicator
    And the loading indicator should disappear when the quote is shown

  @EPMCDMETST-38908-TC04
  Scenario: Error message is displayed when quote retrieval fails
    Given I open the application main screen
    And the quote service is configured to fail
    When I click the "Show Quote" button
    Then I should see the error message "Unable to load a quote. Please try again."
    And I should see the "Show Quote" button enabled

  @EPMCDMETST-38908-TC05
  Scenario: No quotes available message is displayed when dataset is empty
    Given I open the application main screen
    And the quote service is configured to return no quotes
    When I click the "Show Quote" button
    Then I should see the message "No quotes available."

  @EPMCDMETST-38908-TC06
  Scenario: Author is displayed when present
    Given I open the application main screen
    And the quote service returns a quote with author
    When I click the "Show Quote" button
    Then I should see the author displayed with the quote

  @EPMCDMETST-38908-TC07
  Scenario: Source is displayed when present
    Given I open the application main screen
    And the quote service returns a quote with source
    When I click the "Show Quote" button
    Then I should see the source displayed with the quote

  @EPMCDMETST-38908-TC08
  Scenario: Same quote is not shown twice in a row
    Given I open the application main screen
    When I click the "Show Quote" button
    And I capture the displayed quote text as "PreviousQuote"
    And I click the "Show Quote" button
    Then the displayed quote text should not equal "PreviousQuote"

  @EPMCDMETST-38908-TC09
  Scenario: Copy button copies quote text to clipboard and shows confirmation
    Given I open the application main screen
    When I click the "Show Quote" button
    And I click the "Copy" button
    Then the clipboard should contain the displayed quote text
    And I should see a copy confirmation

  @EPMCDMETST-38908-TC10
  Scenario: Share button opens platform share options when supported
    Given I open the application main screen
    When I click the "Show Quote" button
    And I click the "Share" button
    Then the application should invoke the platform share option

  @EPMCDMETST-38908-TC11
  Scenario: Keyboard Enter on focused Show Quote generates a quote
    Given I open the application main screen
    When I focus the "Show Quote" button using keyboard
    And I press "Enter"
    Then I should see a non-empty quote text

  @EPMCDMETST-38908-TC12
  Scenario: Interactive controls have accessible names
    Given I open the application main screen
    Then the "Show Quote" button should have an accessible name
    And the "Copy" button should have an accessible name
    And the "Share" button should have an accessible name
