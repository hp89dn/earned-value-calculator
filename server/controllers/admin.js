var admin = require("firebase-admin");
global.atob = require("atob");
global.Blob = require('node-blob');


var serviceAccount = require("../earned-value-calculator-firebase-adminsdk-iuzm3-3ea902d486.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

exports.create = async(req, response, next) => {
    try {
        const { uid, project_name, created_at } = req.body;

        const res = await db.collection(uid).add({
            created_at: created_at,
            list: "[]",
        });
        const docRef = db.collection(uid).doc(res.id);
        await docRef.update({ id: res.id });

        response.status(201).json({
            id: res.id
        })
    } catch (error) {
        response.status(401).json(error.message);
    }
}

exports.delete = async(req, response, next) => {
    try {
        const { uid, id } = req.body;
        await db.collection(uid).doc(id).delete();
        response.status(201).json("Delete success")
    } catch (error) {
        response.status(401).json(error.message);
    }
}

exports.update = async(req, response, next) => {
    try {
        const { uid, id, data, project_name } = req.body;
        const docRef = db.collection(uid).doc(id);
        await docRef.update({ list: data, project_name: project_name });

        response.status(201).json("Update success")
    } catch (error) {
        response.status(401).json(error.message);
    }
}