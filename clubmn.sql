drop database if exists club_management;
create database club_management;
use club_management;
DROP TABLE IF EXISTS User;
CREATE TABLE User (
  user_id INT AUTO_INCREMENT COMMENT '用户主键' PRIMARY KEY,
  username VARCHAR(32) UNIQUE NOT NULL COMMENT '用户名',
  password VARCHAR(32) NOT NULL COMMENT '密码',
  email VARCHAR(32) COMMENT '邮箱',
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  INDEX idx_username_password (username, password) COMMENT '用户名-密码索引'
);
INSERT INTO User (username, password, email)
VALUES ('alex', 'alex0001', 'alex@example.com'),
  ('ben', 'ben0002', 'ben@example.com'),
  ('carax', 'carax0003', 'carax@example.com'),
  ('david', 'david0004', 'david@example.com'),
  ('edward', 'edward0005', 'edward@example.com'),
  ('frank', 'frank0006', 'frank@example.com'),
  ('george', 'george0007', 'george@example.com'),
  ('haru', 'haru0008', 'haru@example.com'),
  ('isaac', 'isaac0009', 'isaac@example.com'),
  ('jessica', 'jessica0010', 'jessica@example.com'),
  ('kai', 'kai0011', 'kai@example.com'),
  ('ludwig', 'ludwig0012', 'ludwig@example.com'),
  ('minji', 'minji0013', 'minji@example.com'),
  ('nathan', 'nathan0014', 'nathan@example.com'),
  ('oliver', 'oliver0015', 'oliver@example.com'),
  ('paul', 'paul0016', 'paul@example.com'),
  ('quentin', 'quentin0017', 'quentin@example.com'),
  ('ryan', 'ryan0018', 'ryan@example.com'),
  ('steve', 'steve0019', 'steve@example.com'),
  ('tom', 'tom0020', 'tom@example.com'),
  ('ulysses', 'ulysses0021', 'ulysses@example.com'),
  ('victor', 'victor0022', 'victor@example.com'),
  ('william', 'william0023', 'william@example.com'),
  ('xander', 'xander0024', 'xander@example.com'),
  ('yale', 'yale0025', 'yale@example.com'),
  ('zach', 'zach0026', 'zach@example.com');
DROP TABLE IF EXISTS Admin;
CREATE TABLE Admin (
  admin_id INT AUTO_INCREMENT COMMENT '管理员主键' PRIMARY KEY,
  username VARCHAR(32) UNIQUE NOT NULL COMMENT '管理员名',
  password VARCHAR(32) NOT NULL COMMENT '密码',
  email VARCHAR(24) COMMENT '邮箱',
  create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);
INSERT INTO Admin (username, password, email)
VALUES ('admin', 'admin0000', 'admin@example.com');
DROP TABLE IF EXISTS Club;
CREATE TABLE Club (
  club_id INT AUTO_INCREMENT COMMENT '社团主键' PRIMARY KEY,
  club_name VARCHAR(50) NOT NULL COMMENT '社团名称',
  description TEXT NOT NULL COMMENT '简介描述',
  contact_info VARCHAR(64) NOT NULL COMMENT '联系方式',
  activity_space varchar(100) NOT NULL COMMENT '活动场地',
  president_id INT NOT NULL COMMENT '社长ID',
  INDEX idx_president_id (president_id) COMMENT '社长ID索引'
);
INSERT INTO Club (
    club_name,
    description,
    contact_info,
    activity_space,
    president_id
  )
VALUES (
    "Rhythmic Moves",
    "Express your emotions through dance in our club. We offer dance classes, choreography sessions, and stage performances. Join us to feel the rhythm and let your body move!",
    "dance@example.com",
    "Dance Studio",
    1
  ),
  (
    "Sports Unlimited",
    "Calling all sports lovers! Our club promotes active lifestyles through various sports activities. Join us for friendly matches, tournaments, and fitness sessions. Get ready to unleash your inner athlete!",
    "sports@example.com",
    "Sports Complex",
    1
  ),
  (
    "Shutterbugs",
    "Capture the world through the lens in our photography club. We organize photo walks, photography workshops, and exhibitions. Join us to hone your photography skills and showcase your talent!",
    "photography@example.com",
    "Photography Studio",
    2
  ),
  (
    "Scientific Explorers",
    "Embark on a journey of scientific discovery in our club. We conduct experiments, science fairs, and workshops to nurture your curiosity about the world. Join us to explore the wonders of science!",
    "science@example.com",
    "Science Lab",
    3
  ),
  (
    "Silver Screen",
    "Immerse yourself in the world of movies with our film club. We organize movie screenings, discussions, and film festivals. Join us to appreciate and analyze the art of cinema!",
    "film@example.com",
    "Media Room",
    4
  ),
  (
    "Culinary Delights",
    "Join our culinary club to explore the art of cooking and baking. From international cuisines to delectable desserts, we'll tantaludwige your taste buds and satisfy your culinary cravings. Get ready for a gastronomic journey!",
    "culinary@example.com",
    "Kitchen",
    5
  ),
  (
    "Adventure Seekers",
    "Calling all thrill-seekers! Our club organizes exciting outdoor adventures such as hiking, rock climbing, and camping trips. Join us to embrace the spirit of adventure and create unforgettable memories!",
    "adventure@example.com",
    "Outdoor Locations",
    6
  ),
  (
    "Green Earth Society",
    "Join our club to make a difference! We focus on environmental conservation, sustainability projects, and raising awareness about pressing environmental issues. Let's work together to create a greener future!",
    "environment@example.com",
    "Club Room",
    7
  ),
  (
    "Entrepreneurship Hub",
    "Ignite your entrepreneurial spirit in our club. We provide mentorship, workshops, and networking opportunities for aspiring business leaders. Join us to turn your innovative ideas into successful ventures!",
    "business@example.com",
    "Meeting Room",
    8
  ),
  (
    "Fashion Forward",
    "Step into the world of fashion with our club. We organize fashion shows, styling workshops, and discussions on the latest trends. Join us to make a style statement and unleash your fashion sense!",
    "fashion@example.com",
    "Catwalk Studio",
    9
  );
DROP TABLE IF EXISTS Member;
CREATE TABLE Member (
  member_id INT AUTO_INCREMENT COMMENT '成员主键' PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  club_id INT NOT NULL COMMENT '社团ID',
  position ENUM (
    'alreadyQuit',
    'applyQuit',
    'applyJoin',
    'member',
    'cadreMan',
    'vicePresident',
    'president'
  ) NOT NULL COMMENT '社团职位/状态',
  join_date TIMESTAMP NOT NULL COMMENT '加入时间',
  INDEX idx_user_id (user_id) COMMENT '用户id索引'
);
INSERT INTO Member (user_id, club_id, position, join_date)
VALUES -- Club 1: Rhythmic Moves
  (1, 1, 'president', '2023-07-15'),
  (2, 1, 'vicePresident', '2023-07-16'),
  (3, 1, 'vicePresident', '2023-07-18'),
  (4, 1, 'vicePresident', '2023-07-28'),
  (5, 1, 'cadreMan', '2023-07-22'),
  (6, 1, 'cadreMan', '2023-08-24'),
  (7, 1, 'cadreMan', '2023-07-26'),
  (8, 1, 'cadreMan', '2023-08-26'),
  (9, 1, 'cadreMan', '2023-07-26'),
  (10, 1, 'member', '2023-07-28'),
  (11, 1, 'member', '2023-07-28'),
  (12, 1, 'member', '2023-07-29'),
  (13, 1, 'member', '2023-07-28'),
  (14, 1, 'member', '2023-07-28'),
  (15, 1, 'member', '2023-07-13'),
  (16, 1, 'member', '2023-07-28'),
  (17, 1, 'member', '2023-07-23'),
  (18, 1, 'member', '2023-07-28'),
  (19, 1, 'member', '2023-07-28'),
  (20, 1, 'applyJoin', '2023-08-05'),
  (21, 1, 'applyJoin', '2023-08-07'),
  (22, 1, 'applyJoin', '2023-08-09'),
  (23, 1, 'applyQuit', '2023-08-11'),
  (24, 1, 'applyQuit', '2023-08-13'),
  (25, 1, 'alreadyQuit', '2023-07-25'),
  (26, 1, 'alreadyQuit', '2023-07-24'),
  -- Club 2: Sports Unlimited
  (1, 2, 'president', '2023-09-15'),
  (12, 2, 'vicePresident', '2023-10-16'),
  (23, 2, 'vicePresident', '2023-09-18'),
  (4, 2, 'cadreMan', '2023-09-20'),
  (25, 2, 'cadreMan', '2023-09-22'),
  (26, 2, 'cadreMan', '2023-09-24'),
  (7, 2, 'member', '2023-09-26'),
  (18, 2, 'member', '2023-09-18'),
  (19, 2, 'member', '2023-09-30'),
  (10, 2, 'member', '2023-10-01'),
  (11, 2, 'member', '2023-11-03'),
  (2, 2, 'member', '2023-10-25'),
  (13, 2, 'applyJoin', '2023-10-07'),
  (14, 2, 'applyJoin', '2023-10-09'),
  (15, 2, 'applyQuit', '2023-10-11'),
  -- Club 3: Shutterbugs
  (2, 3, 'president', '2023-09-01'),
  (23, 3, 'vicePresident', '2023-09-03'),
  (4, 3, 'vicePresident', '2023-09-05'),
  (5, 3, 'cadreMan', '2023-09-07'),
  (16, 3, 'cadreMan', '2023-09-09'),
  (1, 3, 'cadreMan', '2023-09-11'),
  (18, 3, 'member', '2023-09-13'),
  (19, 3, 'member', '2023-09-15'),
  (10, 3, 'member', '2023-09-17'),
  (11, 3, 'member', '2023-09-19'),
  (12, 3, 'applyJoin', '2023-09-21'),
  (13, 3, 'applyJoin', '2023-09-23'),
  (14, 3, 'applyQuit', '2023-09-25'),
  -- Club 4: Scientific Explorers
  (3, 4, 'president', '2023-08-01'),
  (24, 4, 'vicePresident', '2023-08-03'),
  (25, 4, 'vicePresident', '2023-08-05'),
  (2, 4, 'cadreMan', '2023-08-07'),
  (17, 4, 'cadreMan', '2023-08-09'),
  (8, 4, 'cadreMan', '2023-08-11'),
  (9, 4, 'member', '2023-08-13'),
  (10, 4, 'member', '2023-08-15'),
  (12, 4, 'applyJoin', '2023-08-19'),
  (13, 4, 'applyJoin', '2023-08-21'),
  (1, 4, 'applyQuit', '2023-08-17'),
  (14, 4, 'applyQuit', '2023-08-23'),
  -- Club 5: Silver Screen
  (4, 5, 'president', '2023-10-01'),
  (5, 5, 'vicePresident', '2023-10-03'),
  (1, 5, 'vicePresident', '2023-10-05'),
  (7, 5, 'cadreMan', '2023-10-07'),
  (8, 5, 'cadreMan', '2023-10-09'),
  (9, 5, 'cadreMan', '2023-10-11'),
  (10, 5, 'member', '2023-10-13'),
  (11, 5, 'member', '2023-10-15'),
  (12, 5, 'applyJoin', '2023-10-17'),
  (13, 5, 'applyJoin', '2023-10-19'),
  (14, 5, 'applyQuit', '2023-10-21'),
  -- CLub 8: Green Earth Society
  (7, 8, 'president', '2023-10-17'),
  (1, 8, 'applyJoin', '2023-10-17');
DROP TABLE IF EXISTS Activity;
CREATE TABLE Activity (
  activity_id INT AUTO_INCREMENT COMMENT '活动主键' PRIMARY KEY,
  club_id INT NOT NULL COMMENT '社团ID',
  theme VARCHAR(50) UNIQUE NOT NULL COMMENT '活动主题',
  description TEXT COMMENT '活动描述',
  start_time TIMESTAMP NOT NULL COMMENT '开始时间',
  end_time TIMESTAMP NOT NULL COMMENT '结束时间',
  location VARCHAR(50) NOT NULL COMMENT '活动场地',
  amount decimal(10, 2) NOT NULL COMMENT '活动缴费',
  INDEX idx_club_id (club_id) COMMENT '社团ID索引'
);
INSERT INTO Activity (
    club_id,
    theme,
    description,
    start_time,
    end_time,
    location,
    amount
  )
VALUES (
    -- Club 1: Rhythmic Moves
    1,
    "Dance Gala",
    "An exhilarating evening of dance performances showcasing various styles from contemporary to hip-hop.",
    "2023-08-15 18:00:00",
    "2023-08-15 21:00:00",
    "Dance Studio",
    50.00
  ),
  (
    1,
    "Sports Marathon",
    "A day-long sports event featuring tournaments in basketball, soccer, and volleyball. Open to all skill levels.",
    "2023-09-20 09:00:00",
    "2023-09-20 17:00:00",
    "Sports Complex",
    20.00
  ),
  (
    1,
    "Eco Workshop",
    "Learn about sustainability and participate in activities aimed at reducing our carbon footprint.",
    "2024-03-12 10:00:00",
    "2024-03-12 15:00:00",
    "Club Room",
    15.00
  ),
  -- Club 2: Sports Unlimited
  (
    2,
    "Photography Walk",
    "Join us for a scenic walk through the city as we capture its beauty through our lenses. Suitable for all levels of photographers.",
    "2023-10-05 10:00:00",
    "2023-10-05 14:00:00",
    "City Park",
    30.00
  ),
  (
    2,
    "Science Fair",
    "Showcase your innovative projects or attend workshops at our annual Science Fair. Open to all with a curiosity for science.",
    "2023-11-01 09:00:00",
    "2023-11-01 16:00:00",
    "Science Lab",
    15.00
  ),
  -- Club 3: Shutterbugs
  (
    3,
    "Film Festival",
    "A weekend festival celebrating independent films. Join us for screenings and discussions with filmmakers.",
    "2023-12-10 12:00:00",
    "2023-12-12 20:00:00",
    "Media Room",
    30.00
  ),
  -- Club 4: Scientific Explorers
  (
    4,
    "Culinary Contest",
    "Compete in our culinary contest or join to enjoy tasting a variety of dishes. Categories include desserts, main courses, and vegan.",
    "2024-01-15 11:00:00",
    "2024-01-15 14:00:00",
    "Kitchen",
    10.00
  ),
  -- Club 5: Silver Screen
  (
    5,
    "Hiking Adventure",
    "Explore the great outdoors with a guided hiking adventure. Suitable for all fitness levels.",
    "2024-02-20 08:00:00",
    "2024-02-20 17:00:00",
    "Mountain Trail",
    20.00
  );
DROP TABLE IF EXISTS Summary;
CREATE TABLE Summary (
  summary_id int AUTO_INCREMENT COMMENT '总结表主键' PRIMARY KEY,
  activity_id INT COMMENT '活动ID',
  info text NOT NULL COMMENT '总结内容'
);
INSERT INTO Summary (activity_id, info)
VALUES (
    1,
    "The Dance Gala was a resounding success, with over 10 attendees showcasing their dance skills across contemporary to hip-hop styles. The energy and enthusiasm of the participants lit up the Dance Studio, making it a night to remember."
  ),
  (
    3,
    "The Eco Workshop focused on sustainability and reducing our carbon footprint, attracting a diverse group of students passionate about environmental conservation. Participants engaged in hands-on activities, leaving with a stronger commitment to eco-friendly practices."
  ),
  (
    5,
    "This year's Science Fair was a showcase of innovation, with students presenting projects ranging from renewable energy solutions to new software applications. The fair encouraged a love for science and inquiry, highlighting the talent within our student body."
  ),
  (
    6,
    "The Film Festival was a celebration of independent cinema, with screenings of films from up-and-coming filmmakers. Discussions and Q&A sessions with the creators provided insightful perspectives on the filmmaking process."
  ),
  (
    8,
    "The Hiking Adventure to the Mountain Trail was an exhilarating experience, offering breathtaking views and a much-needed escape into nature. Participants enjoyed a day of physical activity and bonding, highlighting the importance of outdoor adventures."
  );
DROP TABLE IF EXISTS Activity_Participation;
CREATE TABLE Activity_Participation (
  participation_Id INT AUTO_INCREMENT COMMENT '活动参与表ID' PRIMARY KEY,
  activity_id INT NOT NULL COMMENT '活动ID',
  user_id INT NOT NULL COMMENT '用户ID',
  is_signed boolean NOT NULL COMMENT '是否签到',
  INDEX idx_aid_uid (activity_id, user_id) COMMENT '活动id-用户id索引'
);
INSERT INTO Activity_Participation (activity_id, user_id, is_signed)
VALUES -- Dance Gala
  (1, 1, TRUE),
  (1, 22, FALSE),
  (1, 3, TRUE),
  (1, 14, TRUE),
  (1, 5, FALSE),
  (1, 26, TRUE),
  (1, 7, TRUE),
  (1, 8, FALSE),
  (1, 19, TRUE),
  (1, 10, FALSE),
  -- Eco Workshop
  (3, 1, TRUE),
  (3, 23, FALSE),
  (3, 24, FALSE),
  (3, 5, TRUE),
  (3, 6, FALSE),
  (3, 7, FALSE),
  (3, 8, FALSE),
  (3, 19, TRUE),
  (3, 10, TRUE),
  (3, 11, FALSE),
  -- Photography Walk
  (4, 2, TRUE),
  (4, 4, TRUE),
  (4, 15, TRUE),
  (4, 12, FALSE),
  -- Science Fair
  (5, 2, TRUE),
  (5, 12, TRUE),
  (5, 13, FALSE);
DROP TABLE IF EXISTS Fee;
CREATE TABLE Fee (
  fee_id INT AUTO_INCREMENT COMMENT '费用主键' PRIMARY KEY,
  activity_id INT NOT NULL COMMENT '活动ID',
  user_id INT NOT NULL COMMENT '用户ID',
  amount DECIMAL(10, 2) NOT NULL COMMENT '缴费金额',
  is_paid BOOLEAN NOT NULL COMMENT '缴费状态',
  INDEX idx_aid_uid (activity_id, user_id) COMMENT '活动id-用户id索引'
);
INSERT INTO Fee (activity_id, user_id, amount, is_paid)
VALUES -- Dance Gala
  (1, 1, 50.00, TRUE),
  (1, 22, 50.00, FALSE),
  (1, 3, 50.00, TRUE),
  (1, 14, 50.00, TRUE),
  (1, 5, 50.00, FALSE),
  (1, 26, 50.00, TRUE),
  (1, 7, 50.00, FALSE),
  (1, 8, 50.00, FALSE),
  (1, 19, 50.00, FALSE),
  (1, 10, 50.00, FALSE),
  -- Eco Workshop
  (3, 1, 15.00, TRUE),
  (3, 23, 15.00, FALSE),
  (3, 24, 15.00, TRUE),
  (3, 5, 15.00, TRUE),
  (3, 6, 15.00, FALSE),
  (3, 7, 15.00, TRUE),
  (3, 8, 15.00, TRUE),
  (3, 19, 15.00, FALSE),
  (3, 10, 15.00, TRUE),
  (3, 11, 15.00, FALSE),
  -- Photography Walk
  (4, 2, 30.00, TRUE),
  (4, 4, 30.00, FALSE),
  (4, 15, 30.00, TRUE),
  (4, 12, 30.00, FALSE),
  -- Science Fair
  (5, 2, 15.00, TRUE),
  (5, 12, 15.00, TRUE),
  (5, 13, 15.00, TRUE);
DROP TABLE IF EXISTS Club_application;
CREATE TABLE Club_application (
  application_id INT AUTO_INCREMENT COMMENT '社团申请表主键' PRIMARY KEY,
  president_id INT NOT NULL COMMENT '社长ID',
  club_name VARCHAR(50) UNIQUE NOT NULL COMMENT '社团名称',
  description TEXT NOT NULL COMMENT '简介描述',
  contact_info VARCHAR(64) NOT NULL COMMENT '联系方式',
  activity_space varchar(100) NOT NULL COMMENT '活动场地',
  status ENUM ('apply', 'agree', 'reject') COMMENT '审核状态',
  INDEX idx_club_status (status) COMMENT '审核状态索引'
);
INSERT INTO Club_application (
    president_id,
    club_name,
    description,
    contact_info,
    activity_space,
    status
  )
VALUES (
    1,
    "Tech Innovators",
    "A club dedicated to fostering innovation in technology among students. We organize hackathons, workshops, and speaker sessions with industry leaders.",
    "techinnovators@university.com",
    "Tech Lab",
    "apply"
  ),
  (
    2,
    "Eco Warriors",
    "Eco Warriors is focused on promoting environmental awareness and sustainability on campus. Activities include tree planting, eco-friendly projects, and sustainability workshops.",
    "ecowarriors@university.com",
    "Outdoor Garden",
    "apply"
  ),
  (
    23,
    "Artistic Minds",
    "Bringing together students passionate about art, whether it be painting, sculpting, or digital creation. We aim to provide a space for artists to collaborate and showcase their work.",
    "artisticminds@university.com",
    "Art Studio",
    "apply"
  ),
  (
    14,
    "Cinema Circle",
    "A club for film enthusiasts to explore the world of cinema through movie screenings, discussions, and film-making workshops. Open to all who love and appreciate the art of films.",
    "cinemacircle@university.com",
    "Media Room",
    "apply"
  );