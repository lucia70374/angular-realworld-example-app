/// <reference types="cypress" />
describe("Signup & login", () => {
    let randomString = Math.random().toString(36).substring(2);
    let usernameRandom = "Auto" + randomString;
    let emailRandom = "Auto_email" + randomString + "@gmail.com";
    it("Test Valid Signup", () => {
        cy.intercept("POST", "**/*.realworld.io/api/users").as("newUser");//it can start with anything but must end with following
        cy.visit("http://localhost:4200/");

        cy.get(".nav").contains("Sign up").click();
        cy.get("[placeholder='Username']").type(usernameRandom);
        cy.get("[placeholder='Email']").type(emailRandom);
        cy.get("[placeholder='Password']").type("Password1");
        cy.get("button").contains("Sign up").click();

        cy.wait("@newUser").should(({request, response}) => {
            cy.log("Request: " + JSON.stringify(request));
            cy.log("Response: " + JSON.stringify(response));
            expect(response.statusCode).to.eq(200);
            expect(request.body.user.username).to.eq(usernameRandom);
            expect(request.body.user.email).to.eq(emailRandom)

        })


    })
    it("Test Valid Login & Mock Popular Tags", () => {
        cy.intercept("GET", "**/tags", {fixture: 'popularTags.json'});
        cy.visit("http://localhost:4200/");
        cy.get(".nav").contains("Sign in").click();
        cy.get("[placeholder='Email']").type(emailRandom);
        cy.get("[placeholder='Password']").type("Password1");
        cy.get("button").contains("Sign in").click();
        cy.get(':nth-child(4) > .nav-link').contains(usernameRandom);
        cy.get('.tag-list').should("contain", "JavaScript").and("contain", "cypress");


    })
    it("Mock global feed data", () => {
        cy.intercept("GET", "**/api/articles*", {fixture: 'testArticles.json'}).as("articles");
        cy.visit("http://localhost:4200/");
        cy.get(".nav").contains("Sign in").click();
        cy.get("[placeholder='Email']").type(emailRandom);
        cy.get("[placeholder='Password']").type("Password1");
        cy.get("button").contains("Sign in").click();
        cy.get(':nth-child(4) > .nav-link').contains(usernameRandom);
        cy.wait("@articles");



    })
})