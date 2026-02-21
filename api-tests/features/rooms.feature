@api @rooms
Feature: Room Management API
  As an admin user
  I want to manage rooms through the API
  So that the B&B room inventory is up to date

  Background:
    Given the API is accessible
    And I am logged in as admin

  Scenario: Retrieve all rooms
    When I request the list of all rooms
    Then the response status should be 200
    And the response should contain a list of rooms

  Scenario: Retrieve a specific room by ID
    Given a room with ID 1 exists
    When I request room with ID 1
    Then the response status should be 200
    And the room response should contain a "roomName"

  Scenario: Create a new room with valid data
    When I create a room with the following details:
      | roomName | type   | accessible | roomPrice | description        | image             | features      |
      | 301      | Double | true       | 150       | A cozy double room | /images/room2.jpg | WiFi,TV,Views |
    Then the response status should be 201
    And the room response should contain roomName "301"
    And the room response should contain type "Double"
    And the room response should contain roomPrice 150

  Scenario: Create a room with invalid type
    When I create a room with the following details:
      | roomName | type    | accessible | roomPrice | description  | image             | features |
      | 302      | Invalid | false      | 100       | Invalid room | /images/room3.jpg | WiFi     |
    Then the response status should be 400

  Scenario: Update an existing room
    Given I have created a room with name "TestUpdate"
    When I update the room with the following details:
      | roomName   | type | accessible | roomPrice | description       | image             | features     |
      | TestUpdate | Twin | true       | 200       | Updated twin room | /images/room4.jpg | WiFi,TV,Safe |
    Then the response status should be 200
    And the room response should contain type "Twin"
    And the room response should contain roomPrice 200

  Scenario: Delete a room
    Given I have created a room with name "TestDelete"
    When I delete the created room
    Then the response status should be 202

  Scenario: Retrieve rooms without authentication
    Given I am not authenticated
    When I request the list of all rooms
    Then the response status should be 200
