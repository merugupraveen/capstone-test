@api @regression @quotes @EPMCDMETST-37399
Feature: Quotes API
  Contract/behavior checks for Quotes endpoints used by the Random Quote UI.

  # NOTE:
  # - Real endpoints are not provided. Steps below use placeholders like <RANDOM_ENDPOINT>.
  # - Replace with actual API routes, query params, and schemas once known.

  Scenario: Random quote by category returns a quote belonging to that category (TC-RQ-006)
    Given I send a GET request to "<RANDOM_ENDPOINT>?category=motivation"
    Then the response status should be 200
    And the response should include quote fields
    And the quote should belong to category "motivation"

  Scenario: Quote by id returns the expected quote (TC-RQ-008)
    Given I send a GET request to "<QUOTE_BY_ID_ENDPOINT>/q_12345"
    Then the response status should be 200
    And the response should include quote fields

  Scenario: Unknown quote id returns 404 (TC-RQ-009)
    Given I send a GET request to "<QUOTE_BY_ID_ENDPOINT>/q_missing"
    Then the response status should be 404

  Scenario: Invalid category returns 400 (TC-RQ-010)
    Given I send a GET request to "<RANDOM_ENDPOINT>?category=invalid_cat"
    Then the response status should be 400

  Scenario: Rate limit returns 429 (TC-RQ-011)
    Given I have triggered quote generation until rate limited
    Then the response status should be 429
