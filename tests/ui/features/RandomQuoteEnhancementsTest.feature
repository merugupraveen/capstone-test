@ui @regression @quotes @EPMCDMETST-37419
Feature: Random Quote enhancements
  The random quote experience supports configurable sources, attribution, copy,
  history, favorites, filtering, and repetition rules.

  # NOTE:
  # This feature file intentionally uses placeholder steps for UI selectors and
  # app-specific behaviors that are not available in this repository.

  @source
  Scenario: Show Quote retrieves a random quote from a configurable source
    Given the application is configured with a quote source
    When I click the "Show Quote" button
    Then a random quote from the configured source is displayed in the quote area

  @source @fallback
  Scenario: Fallback to local quotes when the source is unavailable
    Given the quote source is unavailable
    And the application has a local fallback quote list
    When I click the "Show Quote" button
    Then a quote from the local fallback list is displayed
    And I see a non-blocking message that online quotes are temporarily unavailable

  @attribution
  Scenario: Display author alongside the quote
    Given a quote with an author is available
    When a quote is shown
    Then the quote text is displayed
    And the author name is displayed near the quote

  @attribution
  Scenario: Handle quotes without author
    Given a quote without an author is available
    When a quote is shown
    Then the quote text is displayed
    And the author field displays "Unknown" or is hidden

  @clipboard
  Scenario: Copy the currently shown quote
    Given a quote is displayed
    When I click the "Copy" button
    Then the quote text (and author if present) is copied to the clipboard
    And I see a confirmation message

  @history
  Scenario: Store shown quotes in a history list
    Given the application is loaded
    When I click "Show Quote" 3 times
    Then I can open "History"
    And I see the last 3 shown quotes in reverse chronological order

  @history
  Scenario: Re-open a quote from history
    Given a quote exists in History
    When I select a quote from History
    Then that quote is displayed in the quote area

  @favorites
  Scenario: Add a quote to favorites
    Given a quote is displayed
    When I click "Favorite"
    Then the quote is added to my Favorites list

  @favorites
  Scenario: Remove a quote from favorites
    Given a quote is in my Favorites list
    When I click "Unfavorite" for that quote
    Then the quote is removed from my Favorites list

  @filtering
  Scenario: Generate a quote from a selected category
    Given categories are available
    When I select category "Inspirational"
    And I click "Show Quote"
    Then the displayed quote belongs to category "Inspirational"

  @repetition
  Scenario: Avoid showing the same quote twice in a row
    Given a quote is displayed
    When I click "Show Quote" again
    Then the newly displayed quote is different from the previously displayed quote