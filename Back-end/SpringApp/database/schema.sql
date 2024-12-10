CREATE TABLE User_Role (
                           id INT PRIMARY KEY AUTO_INCREMENT,
                           role VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE Request_Status (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                status VARCHAR(30) NOT NULL
);

CREATE TABLE Request_Reason (
                                id INT PRIMARY KEY AUTO_INCREMENT,
                                reason VARCHAR(30) NOT NULL
);

CREATE TABLE Approver_Action (
                                 id INT PRIMARY KEY AUTO_INCREMENT,
                                 action VARCHAR(30) NOT NULL
);

CREATE TABLE User (
                      id INT PRIMARY KEY AUTO_INCREMENT,
                      first_name VARCHAR(50) NOT NULL,
                      second_name VARCHAR(50) NOT NULL,
                      password VARCHAR(50) NOT NULL UNIQUE,
                      email VARCHAR(100) NOT NULL UNIQUE,
                      image TEXT NOT NULL,
                      days_for_vac INT NOT NULL,
                      days_to_skip INT NOT NULL,
                      role INT NOT NULL,
                      job_position varchar(50),
                      team_lead INT,
                      tech_lead INT,
                      pm INT,
                      FOREIGN KEY (role) REFERENCES User_Role(id),
                      FOREIGN KEY (team_lead) REFERENCES User(id),
                      FOREIGN KEY (tech_lead) REFERENCES User(id),
                      FOREIGN KEY (pm) REFERENCES User(id)
);

CREATE TABLE Report (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        date DATE NOT NULL,
                        text TEXT NOT NULL,
                        count_of_hours INT NOT NULL,
                        status varchar(50),
                        user INT,
                        FOREIGN KEY (user) REFERENCES User(id)
);

CREATE TABLE Request (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         start_date DATE NOT NULL,
                         finish_date DATE NOT NULL,
                         created_at TIMESTAMP NOT NULL,
                         unique_code VARCHAR(20) NOT NULL,
                         date_of_result TIMESTAMP ,
                         user int,
                         approver_id INT,
                         status INT,
                         reason INT,
                         approver_action INT,
                         comment text ,
                         FOREIGN KEY (approver_id) REFERENCES User(id),
                         FOREIGN KEY (status) REFERENCES Request_Status(id),
                         FOREIGN KEY (reason) REFERENCES Request_Reason(id),
                         FOREIGN KEY (approver_action) REFERENCES Approver_Action(id),
                         FOREIGN KEY (user) REFERENCES User(id)
);

ALTER TABLE Report ADD COLUMN request int references Request(id);

-- Вставка ролей пользователей
INSERT INTO User_Role (role) VALUES
                                 ('ROLE_LEAD'),
                                 ('ROLE_USER'),
                                 ('ROLE_CEO');


-- Вставка статусов запросов
INSERT INTO Request_Status (status) VALUES
                                        ('Pending'),
                                        ('Approved'),
                                        ('Declined');

-- Вставка причин запросов
INSERT INTO Request_Reason (reason) VALUES
                                        ('Annual Leave'),
                                        ('Sick Leave'),
                                        ('Personal Leave'),
                                        ('Work from Home');

-- Вставка действий утверждающего
INSERT INTO Approver_Action (action) VALUES
                                         ('Approve'),
                                         ('Decline'),
                                         ('Unchecked');

-- Шаг 1: Создание CEO и Project Manager
INSERT INTO User (first_name, second_name, password, email, image, days_for_vac, days_to_skip, role, job_position, team_lead, tech_lead, pm) VALUES
    ('Hannah', 'Thomas', 'password008', 'hannah.thomas@example.com', 'https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face1.png?alt=media&token=16531758-4933-487c-bf2a-8a027acf307a', 20, 2, 3, 'CEO', NULL, NULL, NULL); -- СЕО

-- Добавление Project Manager
INSERT INTO User (first_name, second_name, password, email, image, days_for_vac, days_to_skip, role, job_position, team_lead, tech_lead, pm) VALUES
    ('Grace', 'Anderson', 'password007', 'grace.anderson@example.com', 'https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face2.png?alt=media&token=00b3ff76-f272-4fde-a6ad-07f83088d115', 20, 2, 1, 'Project Manager', 1, NULL, NULL); -- ПМ с СЕО

-- Шаг 2: Добавление Team Lead и Tech Lead
INSERT INTO User (first_name, second_name, password, email, image, days_for_vac, days_to_skip, role, job_position, team_lead, tech_lead, pm) VALUES
                                                                                                                                                 ('Alice', 'Johnson', 'password001', 'alice.johnson@example.com', 'https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face3.png?alt=media&token=68f1684a-d5cd-4698-9b86-fffbd734ea77', 20, 2, 1, 'Team Lead', 1, NULL, 2), -- Тим Лид с ПМ
                                                                                                                                                 ('Eve', 'Davis', 'password005', 'eve.davis@example.com', 'https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face4.png?alt=media&token=b7fe6dde-d9ae-49ba-8fb5-d5fa0aeade12', 20, 2, 1, 'Tech Lead', 1, NULL, 2); -- Тех Лид с ПМ

-- Шаг 3: Вставка разработчиков
INSERT INTO User (first_name, second_name, password, email, image, days_for_vac, days_to_skip, role, job_position, team_lead, tech_lead, pm) VALUES
                                                                                                                                                 ('Bob', 'Smith', 'password002', 'bob.smith@example.com', 'https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face5.png?alt=media&token=1491c5c7-7391-4a6b-9071-b95a883e7207', 20, 2, 2, 'Developer', 3, 4, 2), -- Разработчик с Тим Лидом (Alice)
                                                                                                                                                 ('Illia', 'Kamarali', 'password003', 'kamaraliilya@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face6.png?alt=media&token=5de9c272-3373-4fe4-acee-fd6c57e336cc', 20, 2, 2, 'Java Developer', 3, 4, 2), -- Разработчик с Тим Лидом (Alice)
                                                                                                                                                 ('Bohdan', 'Khokhlov', 'password004', 'hohlovb123@gmail.com', 'https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face7.png?alt=media&token=2ef56ec2-d4dc-4dbe-8614-aaadb1da3c70', 20, 2, 2, 'Data Analyst', 3, 4, 2), -- Разработчик с Тим Лидом (Alice)
                                                                                                                                                 ('Frank', 'Miller', 'password006', 'frank.miller@example.com', 'https://firebasestorage.googleapis.com/v0/b/dailylog-44de4.appspot.com/o/face8.png?alt=media&token=518caa3b-a792-44ce-aa91-38a853895cbf', 20, 2, 2, 'Developer', 3, 4, 2); -- Разработчик с Тех Лидом (Eve)


