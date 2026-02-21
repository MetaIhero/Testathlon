@api @messages
Feature: Contact Messages API
  As a guest I can send messages
  As an admin I can view and manage messages

  Background:
    Given the API is accessible

  Scenario: Send a valid contact message
    When I send a message with the following details:
      | name        | email            | phone       | subject                    | description                                              |
      | Test Sender | test@example.com | 01234567890 | Enquiry about availability | I would like to know if you have rooms available in July. |
    Then the response status should be 201
    And the message response should contain name "Test Sender"
    And the message response should contain subject "Enquiry about availability"

  Scenario: Send a message with invalid email
    When I send a message with the following details:
      | name | email        | phone       | subject      | description                                            |
      | Test | not-an-email | 01234567890 | Test Subject | This message has an invalid email address for testing. |
    Then the response status should be 400

  Scenario: Send a message with too short description
    When I send a message with the following details:
      | name | email            | phone       | subject      | description |
      | Test | test@example.com | 01234567890 | Test Subject | Short       |
    Then the response status should be 400

  Scenario: Retrieve all messages as admin
    Given I am logged in as admin
    When I request all messages
    Then the response status should be 200
    And the response should contain a list of messages

  Scenario: Get message count
    When I request the message count
    Then the response status should be 200
    And the response should contain a count value

  Scenario: Delete a message as admin
    Given I am logged in as admin
    And I have sent a test message
    When I delete the sent message
    Then the response status should be 202

  Scenario: Delete a message without authentication fails
    Given I have sent a test message
    And I am not authenticated
    When I delete the sent message
    Then the response status should be 403
