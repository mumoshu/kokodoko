# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20080906183137) do

  create_table "marks", :force => true do |t|
    t.string   "lat"
    t.string   "lng"
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "quiz_id"
    t.integer  "magnify_scale"
    t.integer  "normal_scale"
    t.integer  "demagnify_scale"
  end

  create_table "open_id_authentication_associations", :force => true do |t|
    t.integer "issued"
    t.integer "lifetime"
    t.string  "handle"
    t.string  "assoc_type"
    t.binary  "server_url"
    t.binary  "secret"
  end

  create_table "open_id_authentication_nonces", :force => true do |t|
    t.integer "timestamp",  :null => false
    t.string  "server_url"
    t.string  "salt",       :null => false
  end

  create_table "quizzes", :force => true do |t|
    t.string   "title"
    t.integer  "num_questions"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "magnify_scale"
    t.integer  "normal_scale"
    t.integer  "demagnify_scale"
    t.string   "view_type"
    t.integer  "user_id"
    t.integer  "num_accesses",    :default => 0
    t.integer  "num_plays",       :default => 0
  end

  create_table "scores", :force => true do |t|
    t.integer  "quiz_id"
    t.integer  "user_id"
    t.integer  "score"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "identity_url"
    t.string   "nickname"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
