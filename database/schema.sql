CREATE DATABASE skillfirst;

USE skillfirst;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20),
    location VARCHAR(100)
);

CREATE TABLE workers (
    worker_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    profession VARCHAR(50),
    skill_score DECIMAL(5,2),
    rating DECIMAL(3,2),
    availability BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    worker_id INT,
    skill_name VARCHAR(100),
    verified BOOLEAN,
    score DECIMAL(5,2),
    FOREIGN KEY (worker_id) REFERENCES workers(worker_id)
);

CREATE TABLE assessments (
    assessment_id INT AUTO_INCREMENT PRIMARY KEY,
    worker_id INT,
    question TEXT,
    answer TEXT,
    score DECIMAL(5,2),
    FOREIGN KEY (worker_id) REFERENCES workers(worker_id)
);

CREATE TABLE jobs (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    job_type VARCHAR(100),
    description TEXT,
    location VARCHAR(100),
    urgency VARCHAR(20),
    status VARCHAR(30)
);

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    worker_id INT,
    base_amount DECIMAL(10,2),
    complexity_amount DECIMAL(10,2),
    emergency_amount DECIMAL(10,2),
    performance_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    payment_status VARCHAR(30)
);