const dotenv = require("dotenv");
dotenv.config();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

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
  const item_id = req.body.assignment_id;
  const item = { item_id: item_id, ...req.body };

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
