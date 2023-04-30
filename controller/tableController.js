const dotenv = require("dotenv");
dotenv.config();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, ScanCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.getTable = async (req, res) => {
  const params = {
    TableName: process.env.aws_items_table_name,
  }
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

exports.addItem = async (req, res) => {
  const student_id = req.body.student_id;
  const assignment = req.body.assignment_id;
  const item = { student_id: student_id, assignment: assignment, ...req.body };

  const params = {
    TableName: process.env.aws_items_table_name,
    Item: item,
  }
  try {
    const data = await docClient.send(new PutCommand(params));
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.deleteItem = async (req, res) => {
  const item_id = req.params.item_id;

  const params = {
    TableName: process.env.aws_items_table_name,
    Key: {
      item_id: item_id
    }
  }
  try {
    const data = await docClient.send(new DeleteCommand(params));
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

exports.getStudentTable = async (req, res) => {
  const params = {
      TableName : process.env.aws_items_table_name,
      FilterExpression : 'student_id = :student_id',
      ExpressionAttributeValues: {
        ':student_id': req.params.student_id
      }
  }
  try {
      const data = await docClient.send(new QueryCommand(params));
      res.send(data.Items);
  } catch (err) {
      console.error('Error scanning item:', err);
      res.status(500).send(err);
  }
};

exports.getRow = async (req, res) => {
  const params = {
      TableName : process.env.aws_items_table_name,
      ExpressionAttributeNames: {
        '#pk': 'students_id',
        '#sk': 'assignment'
      },
      ExpressionAttributeValues: {
        ':pk': req.params.student_id,
        ':sk': req.params.assignment_id
      },
      KeyConditionExpression: '#pk = :pk AND #sk = :sk'
  }
  try {
      const data = await docClient.send(new ScanCommand(params));
      res.send(data.Items[0]);
  } catch (err) {
      console.error(err);
      res.status(500).send(err);
  }
}
