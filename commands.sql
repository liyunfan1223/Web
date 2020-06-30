INSERT INTO login(username,passwords,loginType)VALUES('student','student',0)
INSERT INTO login(username,passwords,loginType)VALUES('teacher','teacher',1)
SELECT ID from login where username='student' and passwords='student' and loginType=0;