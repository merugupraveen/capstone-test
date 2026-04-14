@ui @regression @randomQuote @EPMCDMETST-37399
Feature: Random Quote experience
  This feature covers generating, displaying, and interacting with random quotes.

  # Note: UI element names/locators are currently placeholders.
  # Replace placeholders in src/ui/pages/RandomQuotePage.ts once AUT details are known.

  @smoke @TC-RQ-001
  Scenario: Generate a new random quote shows quote text and author
    Given I open the Random Quote page
    When I click the "New quote" button
    Then I should see a non-empty quote text
    And I should see a non-empty quote author

  @TC-RQ-002
  Scenario: Generating a quote twice does not repeat the immediately previous quote
    Given I open the Random Quote page
    When I click the "New quote" button
    And I store the displayed quote as "PreviousQuote"
    And I click the "New quote" button
    Then the displayed quote should not equal "PreviousQuote"

  @TC-RQ-003
  Scenario: Loading indicator is shown while quote is being generated
    Given I open the Random Quote page
    When I click the "New quote" button
    Then I should see the quote loading indicator
    And the quote loading indicator should disappear

  @TC-RQ-004
  Scenario: Friendly error message and retry are shown when quote source is unavailable
    Given I open the Random Quote page
    And the quote source is unavailable
    When I click the "New quote" button
    Then I should see a quote load error message
    And I should see a "Try again" action

  @TC-RQ-005
  Scenario: Retry recovers after transient failure
    Given I open the Random Quote page
    And the quote source fails once then succeeds
    When I click the "New quote" button
    Then I should see a quote load error message
    When I click the "Try again" action
    Then I should see a non-empty quote text
    And I should see a non-empty quote author

  @TC-RQ-006
  Scenario: Copy copies quote text and author to clipboard and shows confirmation
    Given I open the Random Quote page
    And a quote is displayed
    When I click the "Copy" button
    Then the clipboard should contain the displayed quote
    And I should see a copy confirmation message

  @TC-RQ-007
  Scenario: Share opens sharing options and includes quote text and author
    Given I open the Random Quote page
    And a quote is displayed
    When I click the "Share" button
    Then I should see sharing options
    And the share payload should include the displayed quote

  @TC-RQ-008
  Scenario: Category filter generates quotes only from selected category
    Given I open the Random Quote page
    And categories are available
    When I select the "Inspiration" category filter
    And I click the "New quote" button
    Then the displayed quote should belong to category "Inspiration"

  @TC-RQ-009
  Scenario: History panel shows the last 3 generated quotes in order
    Given I open the Random Quote page
    When I generate 3 quotes
    And I open the "History" panel
    Then I should see the last 3 generated quotes in order

  @a11y @TC-RQ-010
  Scenario: New quote button works via keyboard Enter
    Given I open the Random Quote page
    And I focus the "New quote" button
    When I press "Enter"
    Then a new quote should be displayed

  @a11y @TC-RQ-011
  Scenario: Quote region announces updates for assistive technologies
    Given I open the Random Quote page
    And a quote is displayed
    Then the quote region should be configured as an ARIA live region
