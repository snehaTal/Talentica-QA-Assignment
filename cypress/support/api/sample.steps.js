import { Given, Then } from "cypress-cucumber-preprocessor/steps";

Given("I send a GET request to {string}", (url) => {
  cy.request("GET", url);
});

Then("the response should have status code {int}", (statusCode) => {
  cy.get("@response").then((response) => {
    expect(response.status).to.equal(statusCode);
  });
});
