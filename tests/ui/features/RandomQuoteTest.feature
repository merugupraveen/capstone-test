@ui @random-quote @EPMCDMETST-38904 @regression
Feature: Random Quote Generator enhancements

  Background:
    Given I open the Random Quote page

  @smoke
  Scenario: RQ-014 Automation selectors presence (smoke)
    Then the Random Quote page exposes required test ids

  @smoke
  Scenario: RQ-001 Generate quote (success with author)
    When I generate a random quote
    Then I should see loading state while fetching quote
    And I should see quote text displayed
    And I should see quote author displayed
    And copy and share actions should be enabled

  @regression
  Scenario: RQ-002 Generate quote (success without author)
    When I generate a random quote with missing author
    Then I should see quote text displayed
    And author should be hidden or shown as Unknown

  @regression
  Scenario: RQ-003 Primary CTA uniqueness and labeling
    Then I should see a single generate quote CTA with an expected label

  @regression
  Scenario: RQ-004 Loading state behavior and debouncing
    When I generate a random quote with delayed provider response
    Then generate should be disabled while loading
    And no additional quote request should be sent while loading

  @regression
  Scenario: RQ-005 Provider failure shows error and allows retry
    When quote provider is unavailable and I generate a quote
    Then I should see an error state with retry
    When quote provider becomes available and I retry
    Then I should see quote text displayed

  @regression
  Scenario: RQ-006 Copy to clipboard copies quote text + author
    Given a quote is displayed
    When I copy the quote to clipboard
    Then clipboard should contain the quote text
    And clipboard should contain the quote author if present
    And I should see a copy confirmation message

  @regression
  Scenario: RQ-007 Copy fallback behavior when clipboard write fails
    Given a quote is displayed
    And clipboard write is rejected
    When I copy the quote to clipboard
    Then I should see a non-blocking clipboard warning message

  @regression
  Scenario: RQ-008 Share using Web Share API (supported browsers)
    Given a quote is displayed
    And the browser supports web share
    When I share the quote
    Then the native share should be invoked with the quote payload

  @regression
  Scenario: RQ-009 Share fallback when Web Share API is not available
    Given a quote is displayed
    And the browser does not support web share
    When I share the quote
    Then a share fallback UI should be displayed

  @regression
  Scenario: RQ-010 History list order is newest-first
    When I generate two different quotes
    And I open quote history
    Then I should see history list visible
    And the first history item should be the most recent quote

  @regression
  Scenario: RQ-011 Selecting a history item displays it without refetch
    Given I have at least two quotes in history
    When I open quote history
    And I select the second history item
    Then the selected history quote should be displayed
    And no new quote request should be sent

  @regression
  Scenario: RQ-012 Category filter applies to subsequent generation
    When I select quote category "Motivation"
    And I generate a random quote
    Then the displayed quote should belong to category "Motivation"

  @regression
  Scenario: RQ-013 Category filter no-results messaging
    When I select a category with no quotes
    And I generate a random quote
    Then I should see a no results state
    And copy and share actions should be disabled
