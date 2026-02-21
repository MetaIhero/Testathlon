@api @auth
Feature: Authentication API
  As an admin user
  I want to authenticate via the API
  So that I can manage rooms, bookings, and messages

  Background:
    Given the API is accessible

  Scenario: Successful admin login with valid credentials
    When I login with username "admin" and password "password"
    Then the response status should be 200
    And I should receive a valid auth token

  Scenario: Failed login with invalid credentials
    When I login with username "admin" and password "wrongpassword"
    Then the response status should be 403

  Scenario: Failed login with empty credentials
    When I login with username "" and password ""
    Then the response status should be 403

  Scenario: Token validation with valid token
    Given I am logged in as admin
    When I validate my auth token
    Then the response status should be 200

  Scenario: Token validation with invalid token
    When I validate token "invalidtoken123"
    Then the response status should be 403
