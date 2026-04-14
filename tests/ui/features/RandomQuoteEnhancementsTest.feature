@ui @regression @quotes @EPMCDMETST-38875
Feature: Random Quote enhancements
  Automated UI coverage for Random Quote enhancements defined in Jira EPMCDMETST-38875.

  # NOTE:
  # - Locators are currently placeholders because AUT URL/selectors are not available in this repository.
  # - Replace data-testid values in step definitions once the application under test is known.

  @tc_TC-38874-001 @author
  Scenario: Display quote text and author when author is available
    Given the user is on the Quote Generator page
    And the quote dataset is loaded successfully
    When the user selects quote count "1"
    And the user clicks the "Show Quote" button
    Then exactly 1 quote card is displayed
    And the displayed quote text is not empty
    And the displayed quote author is visible and not empty

  @tc_TC-38874-002 @author
  Scenario: Do not display empty author label when author is missing
    Given the user is on the Quote Generator page
    And the quote dataset is loaded successfully
    When the user selects quote count "1"
    And the user clicks the "Show Quote" button
    Then exactly 1 quote card is displayed
    And the displayed quote text is not empty
    And the author element is not displayed for that quote card

  @tc_TC-38874-003 @count
  Scenario: Display total number of available quotes after dataset load
    Given the user is on the Quote Generator page
    When the quote dataset load completes successfully
    Then the UI displays the total number of available quotes
    And the displayed total is a positive integer

  @tc_TC-38874-004 @multi
  Scenario: Generate multiple random quotes based on selected count
    Given the user is on the Quote Generator page
    And the quote dataset is loaded with at least 2 quotes
    When the user selects quote count "2"
    And the user clicks the "Show Quote" button
    Then exactly 2 quote cards are displayed
    And each quote card displays non-empty quote text

  @tc_TC-38874-005 @multi
  Scenario: Prevent duplicates within a generated multi-quote batch
    Given the user is on the Quote Generator page
    And the quote dataset is loaded with at least 2 distinct quotes
    When the user selects quote count "2"
    And the user clicks the "Show Quote" button
    Then exactly 2 quote cards are displayed
    And the quote id of the first card is different from the quote id of the second card

  @tc_TC-38874-006 @navigation
  Scenario: Navigate to All Quotes view and display full list
    Given the user is on the Quote Generator page
    When the user clicks the "All Quotes" navigation link
    Then the All Quotes page is displayed
    And the UI displays a list of all available quotes
    And each list item displays quote text

  @tc_TC-38874-007 @history
  Scenario: Session history lists previously generated quotes in reverse chronological order
    Given the user is on the Quote Generator page
    And the quote dataset is loaded successfully
    When the user selects quote count "1"
    And the user clicks the "Show Quote" button
    And the user clicks the "Show Quote" button again
    Then the History section is displayed
    And the History section contains at least 2 entries
    And the most recent generated quote appears as the first entry in History

  @tc_TC-38874-008 @clipboard
  Scenario: Copy control copies quote text and author to clipboard
    Given the user is on the Quote Generator page
    And a quote card is displayed with quote text and author
    When the user clicks the "Copy" control on the quote card
    Then the system clipboard contains the quote text
    And the system clipboard contains the quote author

  @tc_TC-38874-009 @clipboard
  Scenario: Copy control copies quote text only when author is missing
    Given the user is on the Quote Generator page
    And a quote card is displayed with quote text and no author
    When the user clicks the "Copy" control on the quote card
    Then the system clipboard contains the quote text
    And the system clipboard does not contain an author delimiter or placeholder

  @tc_TC-38874-010 @favorites
  Scenario: Bookmark icon saves quote to favorites
    Given the user is on the Quote Generator page
    And a quote card is displayed
    When the user clicks the "Bookmark" control on the quote card
    Then the quote is marked as bookmarked in the UI
    And the quote appears in the Favorites list or section

  @tc_TC-38874-011 @favorites
  Scenario: Unbookmark removes quote from favorites
    Given the user is on the Quote Generator page
    And a quote card is displayed and is bookmarked
    When the user clicks the "Bookmark" control on the same quote card
    Then the quote is marked as not bookmarked in the UI
    And the quote is removed from the Favorites list or section

  @tc_TC-38874-012 @remote
  Scenario: Remote quote source loads dataset from configured endpoint
    Given the quote source is configured as "remote"
    And the remote quotes endpoint is available
    When the user opens the application
    Then the application loads the quote dataset from the remote endpoint
    And the UI displays the total number of available quotes

  @tc_TC-38874-013 @remote
  Scenario: Graceful handling when remote quote source fails
    Given the quote source is configured as "remote"
    And the remote quotes endpoint is unavailable
    When the user opens the application
    Then the UI displays an error message indicating quotes could not be loaded
    And the application remains responsive
    And the application does not crash

  @tc_TC-38874-014 @a11y
  Scenario: Keyboard accessibility: Show Quote button is reachable and actionable via keyboard
    Given the user is on the Quote Generator page
    When the user navigates to the "Show Quote" button using the Tab key
    And the user activates the button using the Enter key
    Then the application generates quotes according to the selected count
    And the generated quotes are displayed in the quote region

  @tc_TC-38874-015 @a11y
  Scenario: Screen reader accessibility: Show Quote button and quote region have accessible names
    Given the user is on the Quote Generator page
    When the user inspects the accessible name of the "Show Quote" button
    Then the accessible name is present and describes the action
    When the user inspects the quote display region
    Then the quote display region has an accessible label or landmark role

  @tc_TC-38874-016 @empty
  Scenario: Disable Show Quote when dataset is empty
    Given the user is on the Quote Generator page
    And the quote dataset loads successfully with 0 quotes
    Then the UI displays a "No quotes available" message
    And the "Show Quote" button is disabled

  @tc_TC-38874-017 @remote
  Scenario: All Quotes view shows loading state until dataset load completes
    Given the quote source is configured as "remote"
    And the remote quotes endpoint responds slowly
    When the user opens the All Quotes page
    Then the UI displays a loading indicator
    And the UI does not display an empty list as a loaded state
    When the quote dataset load completes
    Then the UI displays the list of all available quotes
