// reset password / login

const { login } = require("../services/authService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailer");
const authModels = require("../models/authModels");

jest.mock("../models/authModels");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../config/nodemailer", () => ({
  sendMail: jest.fn(),
}));

describe("login", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("la méthode rejette une erreur lorsque l'utilisateur n'existe pas", async () => {
        authModels.findByEmail.mockResolvedValue(null);
        await expect(login("john@doe.fr", "password1234++")).rejects.toThrow(new Error("Utilisateur inexistant."));

        expect(authModels.findByEmail).toHaveBeenCalledTimes(1);
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(jwt.sign).not.toHaveBeenCalled();
    })

    it ("login rejette erreur quand le mot de passe ne match pas avec celui en paramètre", async () => {
        authModels.findByEmail.mockResolvedValue({
            id: 1,
            email: "john@doe.fr",
            password: "hashed-password",
            role: "user",
            firstname: "John",
            lastname: "Doe"
        });

        bcrypt.compare.mockResolvedValue(false);

        await expect(login("john@doe.fr", "password1234++")).rejects.toThrow(new Error("Mot de passe incorrecte."));

        expect(authModels.findByEmail).toHaveBeenCalledWith("john@doe.fr");
        expect(bcrypt.compare).toHaveBeenCalledWith("password1234++", "hashed-password");

        expect(jwt.sign).not.toHaveBeenCalled();

    })

    it ("login rejette si il y a un problème au niveau de la formation du jwt", async () => {
        authModels.findByEmail.mockResolvedValue({
            id: 1,
            email: "john@doe.fr",
            password: "hashed-password",
            role: "user",
            firstname: "John",
            lastname: "Doe"
        });

        bcrypt.compare.mockResolvedValue(true);

        jwt.sign.mockImplementation(() => {
            throw new Error("JWT error");
        });

        await expect(login("john@doe.fr", "password1234++")).rejects.toThrow(new Error("Erreur lors de la génération du token"));

        expect(authModels.findByEmail).toHaveBeenCalledWith("john@doe.fr");
        expect(bcrypt.compare).toHaveBeenCalledWith("password1234++", "hashed-password");
        expect(jwt.sign).toHaveBeenCalledTimes(1);

    });

    it ("login retourne le bon utilisateur avec son id, son email et son token généré", async () => {
        authModels.findByEmail.mockResolvedValue({
            id: 1,
            email: "john@doe.fr",
            password: "hashed-password",
            role: "user",
            firstname: "John",
            lastname: "Doe"
        });

        bcrypt.compare.mockResolvedValue(true);

        jwt.sign.mockReturnValue("azerty1234.valid.token");

        await expect(login("john@doe.fr", "password1234++")).resolves.toEqual({
            id: 1,
            email: "john@doe.fr",
            token: "azerty1234.valid.token"
        });

        expect(authModels.findByEmail).toHaveBeenCalledWith("john@doe.fr");
        expect(bcrypt.compare).toHaveBeenCalledWith("password1234++", "hashed-password");
        expect(jwt.sign).toHaveBeenCalledTimes(1);

    })

})