@ui @regression @random_quote @EPMCDMETST-37399
Feature: Display a Random Quote on Button Click

  Background:
    Given I open the application

  @smoke
  Scenario: Button is visible on the main screen
    Then I should see a button labeled "Show Quote"

  Scenario: Quote display area is present
    Then I should see an area dedicated to displaying a quote

  Scenario: No quote or default quote on initial load
    Then I should see either no quote or a default quote displayed

  Scenario: Display a random quote from a hardcoded list
    When I click the "Show Quote" button
    Then a random quote from the hardcoded list should be displayed in the quote area

  Scenario: Quote updates on each button click
    Given a quote is currently displayed
    When I click the "Show Quote" button
    Then the displayed quote should update to a new random quote

  @optional
  Scenario: No immediate repetition of quotes (optional)
    Given a quote is currently displayed
    When I click the "Show Quote" button
    Then the new quote should not be the same as the previously displayed quote

  Scenario: Quote is displayed in readable format
    Given a quote is displayed
    Then the quote should be clearly readable

  Scenario: Responsive design
    Given I am using a desktop or mobile device
    Then the button and quote area should be accessible and usable
