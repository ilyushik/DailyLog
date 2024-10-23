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
                        user INT,
                        FOREIGN KEY (user) REFERENCES User(id)
);

CREATE TABLE Request (
                         id INT PRIMARY KEY AUTO_INCREMENT,
                         start_date DATE NOT NULL,
                         finish_date DATE NOT NULL,
                         created_at TIMESTAMP NOT NULL,
                         unique_code VARCHAR(20) NOT NULL,
                         date_of_result TIMESTAMP NOT NULL,
                         user int,
                         approver_id INT,
                         status INT,
                         reason INT,
                         approver_action INT,
                         FOREIGN KEY (approver_id) REFERENCES User(id),
                         FOREIGN KEY (status) REFERENCES Request_Status(id),
                         FOREIGN KEY (reason) REFERENCES Request_Reason(id),
                         FOREIGN KEY (approver_action) REFERENCES Approver_Action(id),
                         FOREIGN KEY (user) REFERENCES User(id)
);

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
                                         ('Decline');

-- Шаг 1: Создание CEO и Project Manager
INSERT INTO User (first_name, second_name, password, email, image, days_for_vac, days_to_skip, role, job_position, team_lead, tech_lead, pm) VALUES
    ('Hannah', 'Thomas', 'password008', 'hannah.thomas@example.com', 'https://1drv.ms/i/c/2ed1fe62a05badfb/IQQKRCBNXdr0SqTtR3G9HzCjAXT_Je4e14BPo0fGAeVmFQ8?width=900&height=900', 20, 2, 3, 'CEO', NULL, NULL, NULL); -- СЕО

-- Добавление Project Manager
INSERT INTO User (first_name, second_name, password, email, image, days_for_vac, days_to_skip, role, job_position, team_lead, tech_lead, pm) VALUES
    ('Grace', 'Anderson', 'password007', 'grace.anderson@example.com', 'https://1drv.ms/i/c/2ed1fe62a05badfb/IQR_KKMZy-dyRLje0OopM8BJAbjtKGTcCw7BonNRJeBZWys?width=1024', 20, 2, 1, 'Project Manager', 1, NULL, NULL); -- ПМ с СЕО

-- Шаг 2: Добавление Team Lead и Tech Lead
INSERT INTO User (first_name, second_name, password, email, image, days_for_vac, days_to_skip, role, job_position, team_lead, tech_lead, pm) VALUES
                                                                                                                                                 ('Alice', 'Johnson', 'password001', 'alice.johnson@example.com', 'https://1drv.ms/i/c/2ed1fe62a05badfb/IQQ0XzqjmC_4T4n_dDftCiFqARZ_aqMeps4wauwGwvsTtuE?width=1024', 20, 2, 1, 'Team Lead', 1, NULL, 2), -- Тим Лид с ПМ
                                                                                                                                                 ('Eve', 'Davis', 'password005', 'eve.davis@example.com', 'https://1drv.ms/i/c/2ed1fe62a05badfb/IQRjH5jzOLnQQrz9cUVBWDp3AbkBk9buLfl9zCWkyZ87fHY?width=1024', 20, 2, 1, 'Tech Lead', 1, NULL, 2); -- Тех Лид с ПМ

-- Шаг 3: Вставка разработчиков
INSERT INTO User (first_name, second_name, password, email, image, days_for_vac, days_to_skip, role, job_position, team_lead, tech_lead, pm) VALUES
                                                                                                                                                 ('Bob', 'Smith', 'password002', 'bob.smith@example.com', 'https://1drv.ms/u/c/2ed1fe62a05badfb/IQSa2j9Y3iu4TL65jNOH8k_HAYbpbw3RHJYUYLq3xV1qwlI?width=1024', 20, 2, 2, 'Developer', 3, 4, 2), -- Разработчик с Тим Лидом (Alice)
                                                                                                                                                 ('Charlie', 'Brown', 'password003', 'charlie.brown@example.com', 'https://1drv.ms/u/c/2ed1fe62a05badfb/IQQuUe4v5CwYR4h0LJ5XGZXeAdtvWtNCnEVZintNCDPaMLw?width=1024', 20, 2, 2, 'Developer', 3, 4, 2), -- Разработчик с Тим Лидом (Alice)
                                                                                                                                                 ('David', 'Wilson', 'password004', 'david.wilson@example.com', 'https://1drv.ms/i/c/2ed1fe62a05badfb/IQR7Nbx3EN6_RqzLkGV_VKbaAaTRUM3ePfu7zTdG29lgES4?width=1024', 20, 2, 2, 'Developer', 3, 4, 2), -- Разработчик с Тим Лидом (Alice)
                                                                                                                                                 ('Frank', 'Miller', 'password006', 'frank.miller@example.com', 'https://1drv.ms/i/c/2ed1fe62a05badfb/IQSxxNYdcNg7SZxQxulSaZvIASurfo8hGx75epvnebhG0dk?width=1024', 20, 2, 2, 'Developer', 3, 4, 2); -- Разработчик с Тех Лидом (Eve)

-- Вставка отчетов
INSERT INTO Report (date, text, count_of_hours, user) VALUES
                                                          ('2024-10-01', 'Completed module A', 8, 1),
                                                          ('2024-10-02', 'Worked on bug fixing', 6, 2),
                                                          ('2024-10-03', 'Developed new feature', 7, 3),
                                                          ('2024-10-04', 'Project management tasks', 5, 4);

-- Вставка запросов
INSERT INTO Request (start_date, finish_date, created_at, unique_code, date_of_result, approver_id, status, reason, approver_action, user) VALUES
                                                                                                                                         ('2024-11-01', '2024-11-10', '2024-10-10 08:00:00', 'REQ12345', '2024-10-11 12:00:00', 2, 2, 2, 1, 5),
                                                                                                                                         ('2024-12-05', '2024-12-15', '2024-11-15 09:00:00', 'REQ67890', '2024-11-16 10:00:00', 3, 2, 2, 1, 5),
                                                                                                                                         ('2024-10-20', '2024-10-22', '2024-10-15 14:00:00', 'REQ11111', '2024-10-17 16:00:00', 4, 2, 2, 1, 5);
