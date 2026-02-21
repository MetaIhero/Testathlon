@api @booking
Feature: Booking API
  As a guest or admin
  I want to manage bookings through the API
  So that room reservations can be created, viewed, and managed

  Background:
    Given the API is accessible

  Scenario: Create a booking with valid data
    When I create a booking with the following details:
      | roomid | firstname | lastname | depositpaid | checkin    | checkout   | email             | phone       |
      | 1      | Test      | Guest    | true        | 2026-06-01 | 2026-06-03 | guest@example.com | 01234567890 |
    Then the response status should be 201
    And the booking response should contain firstname "Test"
    And the booking response should contain lastname "Guest"

  Scenario: Create a booking with missing required fields
    When I create a booking with the following details:
      | roomid | firstname | lastname | depositpaid | checkin    | checkout   |
      | 1      |           | Guest    | true        | 2026-06-10 | 2026-06-12 |
    Then the response status should be 400

  Scenario: Retrieve bookings for a specific room
    Given I am logged in as admin
    When I request bookings for room ID 1
    Then the response status should be 200
    And the response should contain a list of bookings

  Scenario: Get booking summary for a room
    When I request the booking summary for room ID 1
    Then the response status should be 200

  Scenario: Delete a booking
    Given I am logged in as admin
    And I have created a booking for room 1
    When I delete the created booking
    Then the response status should be 202
