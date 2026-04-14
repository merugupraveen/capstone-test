@ui @regression @quote @EPMCDMETST-37399
Feature: Display a random quote on button click
  As a user
  I want to see a random quote displayed each time I click a button
  So that I can get inspired or entertained with different quotes

  Background:
    Given I open the Random Quote page

  @smoke
  Scenario: Button is visible on the main screen
    Then I should see a button labeled "Show Quote"

  Scenario: Quote display area is present
    Then I should see an area dedicated to displaying a quote

  Scenario: No quote or default quote on initial load
    Then I should see either no quote or a default quote displayed

  Scenario: Display a random quote from a hardcoded list
    When I click the "Show Quote" button
    Then a quote should be displayed in the quote area

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

  @responsive
  Scenario: Responsive design
    Then the button and quote area should be accessible and usable