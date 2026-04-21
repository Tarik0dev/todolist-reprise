// reset password / login

const { login, resetPassword } = require("../services/authService");
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

describe("reset-password", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("reset-password rejette une erreur lorsque le mot de password n'est pas conforme ou null", async () => {
        await expect(resetPassword("", "xxxx.xxxx.xxxx")).rejects.toThrow("Mot de passe non renseigné ou incorrecte.");
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(authModels.findByEmail).not.toHaveBeenCalled();
        expect(authModels.resetPassword).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();

    });

    it("reset-password rejette une erreur lorsque le token n'est pas conforme ou null", async () => {
        await expect(resetPassword("azerty1234+", null)).rejects.toThrow("Token incorrecte");
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(authModels.findByEmail).not.toHaveBeenCalled();
        expect(authModels.resetPassword).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();

    });

    it("reset-password rejette une erreur lorsque le token n'est pas conforme ou null", async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error("invalid token");
        });
        await expect(resetPassword("azerty1234+", "xxxx.xxxx.xxxx")).rejects.toThrow("Token invalide");
        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(authModels.findByEmail).not.toHaveBeenCalled();
        expect(authModels.resetPassword).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();

    });

    it("reset-password rejette une erreur lorsque l'email issu du token n'est pas valide", async () => {
        jwt.verify.mockReturnValue({
            email: "john@doe.fr",
        });
        
        authModels.findByEmail.mockResolvedValue(null);

        await expect(resetPassword("azerty1234+", "xxxx.xxxx.xxxx")).rejects.toThrow("Utilisateur inexistant.");
        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(authModels.findByEmail).toHaveBeenCalledWith("john@doe.fr");
        expect(authModels.resetPassword).not.toHaveBeenCalled();
        expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it("reset-password doit modifier le mot de passe de l'utilisateur avec le nouveau mot de passe hashé", async () => {
        jwt.verify.mockReturnValue({
            email: "john@doe.fr",
        });
        
        authModels.findByEmail.mockResolvedValue({
            id: 1,
            email: "john@doe.fr",
            password: "hashed-password",
            role: "user",
            firstname: "John",
            lastname: "Doe"
        });

        bcrypt.hash.mockReturnValue("new-hashed-password");

        await resetPassword("azerty1234+", "xxxx.xxxx.xxxx");

        expect(jwt.verify).toHaveBeenCalledTimes(1);
        expect(authModels.findByEmail).toHaveBeenCalledWith("john@doe.fr");
        expect(bcrypt.hash).toHaveBeenCalled();

        expect(authModels.resetPassword).toHaveBeenCalledWith("john@doe.fr", "new-hashed-password");

    });


})