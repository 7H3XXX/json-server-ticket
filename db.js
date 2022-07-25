//priority = 1urgent, 2important, 3moyen, 4normal
//impact = 1tres critique, 2critique, 3modere, 4insignifiant
//status = 1nouveau, 2assigne, 3en attente, 4resolu, 5ferme
const data = {
    "tickets": [
        {
            "idTicket": 1,
            "title": "Ticket1",
            "status": 2,
            "reporter": "Yvan Dipoko",
            "assignee": "Ngaba Marc-Antoine",
            "source": "Bonanjo",
            "priority": 1,
            "impact": 2,
            "createdAt": new Date().toDateString(),
            "closedAt": new Date().toDateString(),
            "departement": "GFC"
        },
        {
            "idTicket": 2,
            "title": "Ticket2",
            "status": 1,
            "reporter": "Fredy Ted",
            "assignee": "Krys Hercael",
            "source": "Hippodrome",
            "priority": 2,
            "impact": 3,
            "createdAt": new Date().toDateString(),
            "closedAt": new Date().toDateString(),
            "departement": "Service Juridique"
        },
        {
            "idTicket": 3,
            "title": "Ticket3",
            "status": 3,
            "reporter": "Yvan Dipoko",
            "assignee": "Ngaba Marc-Antoine",
            "source": "Bertoua",
            "priority": 4,
            "impact": 2,
            "createdAt": new Date().toDateString(),
            "closedAt": new Date().toDateString(),
            "departement": "Operations locales"
        }
    ],
    "users": [
        {
            "id": 1,
            "username": "ebed",
            "agence": "Bonanjo",
            "departement": "GFC",
            "lastLogin": new Date().toDateString(),
            "groupId": 3

        },
        {
            "id": 2,
            "username": "archimed1",
            "agence": "Hippodrome",
            "departement": "DSI",
            "lastLogin": new Date().toDateString(),
            "groupId": 1

        },
        {
            "id": 3,
            "username": "yvandip",
            "agence": "Bonanjo",
            "departement": "DSI",
            "lastLogin": new Date().toDateString(),
            "groupId": 2

        }
    ],
    "groups": [
        {
            "idGroup": 1,
            "title": "Super Admins",
            "idRole": 1
        },
        {
            "idGroup": 2,
            "title": "Admins",
            "idRole": 2
        },
        {
            "idGroup": 3,
            "title": "Agents",
            "idRole": 3
        }
    ],
    "roles": [
        {
            "idRole": 1,
            "title": "Super Administrator",
            "description": "Gere le systeme"
        },
        {
            "idRole": 2,
            "title": "Administrator",
            "description": "Gere l'agence'"
        },
        {
            "idRole": 3,
            "title": "Agent",
            "description": "Reporte les dysfonctionnement"
        },
    ],
    "agencies": [
        {
            "idAgency": 1,
            "name": "Hippodrome",
            "region": "Centre",
            "city": "Yaounde",
            "niveau": 1,
            "adresse": "Avenue des banques"
        },
        {
            "idAgency": 2,
            "name": "Bonanjo",
            "region": "Littoral",
            "city": "Douala",
            "niveau": 2,
            "adresse": "Face SGC"
        },
        {
            "idAgency": 3,
            "name": "Mboppi",
            "region": "Littoral",
            "city": "Douala",
            "niveau": "2",
            "adresse": "Face SGC"
        },
    ],

    "knowledgeBase": [
        {
            "idKnowledgeBase": 1,
            "name": "Hippodrome",
            "region": "Centre",
            "city": "Yaounde",
            "niveau": 1,
            "adresse": "Avenue des banques"
        },
        {
            "idKnowledgeBase": 2,
            "name": "Bonanjo",
            "region": "Littoral",
            "city": "Douala",
            "niveau": 2,
            "adresse": "Face SGC"
        },
        {
            "idKnowledgeBase": 3,
            "name": "Mboppi",
            "region": "Littoral",
            "city": "Douala",
            "niveau": 3,
            "adresse": "Face SGC"
        },
    ]
}