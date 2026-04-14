@ui @regression @randomQuote @EPMCDMETST-37399
Feature: Random Quote UI
  The Random Quote page should allow users to view, regenerate, copy, share, and filter quotes.

  # NOTE:
  # - This repository currently points to https://example.com by default (UI_BASE_URL).
  # - The AUT URL paths, labels, and locators are unknown from the provided story/tests.
  # - Scenarios below use placeholders (e.g. <RANDOM_QUOTE_PATH>) that must be replaced
  #   with the real application routes and control labels.

  @smoke
  Scenario: Load Random Quote page displays quote text, author, and optional source (TC-RQ-001)
    Given I open the Random Quote page
    Then I should see a quote text
    And I should see the quote author
    And I should see the quote source only if present

  Scenario: Generate action is visible, focusable, and Enter triggers generation (TC-RQ-002)
    Given I open the Random Quote page
    Then I should see the generate new quote action
    And the generate action should be keyboard focusable
    When I activate generate using the keyboard
    Then a new quote should be displayed

  Scenario: Regeneration shows loading state and updates quote (TC-RQ-003)
    Given I open the Random Quote page
    And I capture the current quote
    When I click generate new quote
    Then I should see a quote loading indicator
    And a new quote should be displayed

  Scenario: Copy copies "<text> — <author>" and shows "Copied" confirmation (TC-RQ-004)
    Given I open the Random Quote page
    And I capture the current quote
    When I click copy quote
    Then the clipboard should contain the formatted quote
    And I should see a copied confirmation

  Scenario: Share provides a permalink that reproduces the same quote when opened (TC-RQ-005)
    Given I open the Random Quote page
    And I capture the current quote id
    When I click share quote
    Then I should get a shareable quote URL containing the quote id

  Scenario: Category selector scopes random generation (TC-RQ-006)
    Given I open the Random Quote page
    When I select the category "Motivation"
    And I click generate new quote
    Then the displayed quote should belong to category "Motivation"

  Scenario: Initial load failure shows error + Retry and recovers (TC-RQ-007)
    Given the quote service is unavailable
    When I open the Random Quote page
    Then I should see a quote load error message
    And I should see a retry action
    When the quote service becomes available
    And I click retry quote load
    Then I should see a quote text

  Scenario: Invalid quote id shows not found and provides recovery path (TC-RQ-009)
    Given I open the Quote permalink page for id "q_missing"
    Then I should see a quote not found message
    And I should see a recovery action to return or generate a new quote
