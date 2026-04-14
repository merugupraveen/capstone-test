@ui @regression @quotes @EPMCDMETST-38532
Feature: Random Quote Generator - market analysis regression coverage
  # NOTE:
  # The AUT (https://coda.io/@mark-davis/random-quote) is a published Coda document.
  # During analysis, stable interactive controls (e.g., "Generate quote") were not reliably accessible.
  # Scenarios below are written to be automation-ready but may require locator updates once
  # the AUT exposes deterministic selectors/roles for the actions.

  @smoke
  Scenario: User opens the Random Quote Generator page and sees the title
    Given I open the Random Quote Generator page
    Then I should see the page title containing "Random Quote Generator"

  Scenario: Page exposes a primary action to generate a quote (placeholder until control is confirmed)
    Given I open the Random Quote Generator page
    Then I should see a generate quote action

  Scenario: User generates a quote (placeholder until control is confirmed)
    Given I open the Random Quote Generator page
    When I generate a random quote
    Then I should see a quote displayed

  Scenario: User copies the displayed quote (placeholder until control is confirmed)
    Given I open the Random Quote Generator page
    And I generate a random quote
    When I copy the displayed quote
    Then the clipboard should contain the displayed quote

  Scenario: User shares a displayed quote via shareable link (placeholder until behavior is confirmed)
    Given I open the Random Quote Generator page
    And I generate a random quote
    When I get a shareable quote link
    Then opening the shareable link should restore the same quote
