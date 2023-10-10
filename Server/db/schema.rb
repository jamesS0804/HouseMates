# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2023_10_10_233328) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "addresses", force: :cascade do |t|
    t.string "address_line_1", default: "", null: false
    t.string "barangay", default: "", null: false
    t.string "city", default: "", null: false
    t.string "province", default: "", null: false
    t.string "zip_code", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "profile_id"
    t.bigint "booking_id"
    t.index ["booking_id"], name: "index_addresses_on_booking_id"
    t.index ["profile_id"], name: "index_addresses_on_profile_id"
  end

  create_table "booking_services", force: :cascade do |t|
    t.integer "quantity", default: 1, null: false
    t.decimal "price_per_quantity", precision: 10, scale: 2, null: false
    t.decimal "total", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "service_id", null: false
    t.bigint "subservice_id", null: false
    t.bigint "booking_id"
    t.string "title", null: false
    t.index ["booking_id"], name: "index_booking_services_on_booking_id"
    t.index ["service_id"], name: "index_booking_services_on_service_id"
    t.index ["subservice_id"], name: "index_booking_services_on_subservice_id"
  end

  create_table "bookings", force: :cascade do |t|
    t.datetime "scheduled_at", null: false
    t.integer "status", default: 0, null: false
    t.decimal "total_cost", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "housemate_id"
    t.string "payment_method", null: false
    t.bigint "homeowner_id", null: false
    t.string "service_title", null: false
    t.integer "service_id"
    t.index ["homeowner_id"], name: "index_bookings_on_homeowner_id"
    t.index ["housemate_id"], name: "index_bookings_on_housemate_id"
  end

  create_table "homeowners", force: :cascade do |t|
    t.string "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "housemate_services", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", null: false
    t.string "service_title", null: false
    t.bigint "housemate_id", null: false
    t.bigint "service_id", null: false
    t.index ["housemate_id"], name: "index_housemate_services_on_housemate_id"
    t.index ["service_id"], name: "index_housemate_services_on_service_id"
  end

  create_table "housemates", force: :cascade do |t|
    t.string "type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "profiles", force: :cascade do |t|
    t.string "name", null: false
    t.string "phone_number", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.string "email"
    t.decimal "balance", precision: 10, scale: 2
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "services", force: :cascade do |t|
    t.string "title", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
  end

  create_table "subservices", force: :cascade do |t|
    t.string "title", null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "service_id", null: false
    t.string "service_title", null: false
    t.string "category"
    t.string "image_url"
    t.string "unit"
    t.index ["service_id"], name: "index_subservices_on_service_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", null: false
    t.boolean "is_verified", default: false
    t.string "type", null: false
    t.boolean "is_active", default: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
  end

  add_foreign_key "addresses", "bookings"
  add_foreign_key "addresses", "profiles"
  add_foreign_key "booking_services", "bookings"
  add_foreign_key "booking_services", "services"
  add_foreign_key "booking_services", "subservices"
  add_foreign_key "housemate_services", "services"
  add_foreign_key "housemate_services", "users", column: "housemate_id"
  add_foreign_key "profiles", "users"
  add_foreign_key "subservices", "services"
end
