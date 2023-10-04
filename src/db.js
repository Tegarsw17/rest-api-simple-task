const { Pool } = require('pg')
const connectionLink =
  'postgres://postgres.ayiuazpfqdmqpppuahpr:LabPGTegar003@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'

const pool = new Pool({
  host: 'db.ayiuazpfqdmqpppuahpr.supabase.co',
  user: 'postgres',
  password: 'LabPGTegar003',
  database: 'postgres',
  port: '5432',
})

module.exports = pool
