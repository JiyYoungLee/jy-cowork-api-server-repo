//05. 직원 정보 조회하기~
const express = require('express');

const app = express();

const db = require('./models');

const { Member } = db;

//middleware
app.use(express.json());
// 여기에 두 번째 미들웨어를 설정.
app.use((req, res, next) => {
    console.log(req.query);
    next();
  });
  /**/

app.get('/api/members', async(req, res) => {
    const { team } =req.query;
    if (team) {
        const teamMembers = await Member.findAll({ where : { team }, order: [['admissionDate', 'DESC']], });
        res.send(teamMembers);
    } else {
        const members = await Member.findAll({ order: [['admissionDate', 'DESC']], });
        res.send(members);
    }
});

app.get('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const member = await Member.findOne({ where: { id } });
    if (member) {
        console.log(member.toJSON()); // 추가한 코드
        res.send(member);
    } else {
        res.status(404).send( {message: 'There is no such member with the id!'});
    }
});
////:id 라우트 파라미터라고 한다.

app.post('/api/members', async (req, res) => {
    const newMember = req.body;
    // console.log(req.body);
    const member = Member.build(newMember);
    console.log('Before: ${member.id}');
    await member.save();
    console.log('After: ${member.id}');
    res.send(newMember);
})

// app.put('/api/members/:id', async (req, res) => {
//     const { id } = req.params;
//     const newInfo = req.body;
//     const result = await Member.update(newInfo, { where: { id } });
//     if (result[0]) {
//         res.send({ message: `${result[0]} row(s) affected`});
//     } else {
//         res.status(404).send( {message: 'There is no such member with the id!'});
//     }
// });
app.put('/api/members/:id', async (req, res) => {
    const { id } = req.params;
    const newInfo = req.body;
    const member = await Member.findOne({ where: { id } });
    if (member) {
        Object.keys(newInfo).forEach((prop) => {
            member[prop] = newInfo[prop];
        });
        await member.save();
        res.send(member);
    } else {
        res.status(404).send( {message: 'There is no such member with the id!'});
    }
});

app.delete('/api/members/:id', (req, res) => {
    const { id } = req.params;
    const deletedCount = await Member.destroy({ where: { id } });
    if (deletedCount) {
        res.send({ message: `${deletedCount} row(s) deleted` });
    } else {
        res.status(404).send( {message: 'There is no such member with the id!'});
    }
});
// app.delete('/api/members/:id', (req, res) => {
//     const { id } = req.params;
//     const memberCount = Member.length;
//     members = Member.filter((mem) => mem.id !== Number(id));
//     if (Member.length < memberCount) {
//         res.send({message: 'Deleted'});
//     } else {
//         res.status(404).send( {message: 'There is no such member with the id!'});
//     }
// });

app.listen(process.env.PORT|| 3000, () => {
    console.log('server is listening...');
});
