CREATE TABLE users (
    id INTEGER PRIMARY KEY , -- unique identifier for each user
    name TEXT, -- user's name
    active INTEGER DEFAULT 1, -- whether the user is currently active or not (default: 1)
    password_hash TEXT, -- hashed password for user's account
    role INTEGER DEFAULT 0, -- user's role (default: 0)
    FOREIGN KEY (role) REFERENCES user_role(id) ON DELETE CASCADE -- enforce referential integrity to user_role table
);

CREATE TABLE user_role (
    id INTEGER PRIMARY KEY , -- unique identifier for each role
    name TEXT -- name of the role
);

INSERT INTO user_role (name) VALUES -- insert predefined roles into user_role table
    ('student'),
    ('teacher'),
    ('admin');

CREATE TABLE items (
    id INTEGER PRIMARY KEY , -- unique identifier for each item
    name TEXT, -- item's name
    type INTEGER, -- item's type
    FOREIGN KEY (type) REFERENCES item_types(id) ON DELETE CASCADE -- enforce referential integrity to item_types table
);

CREATE TABLE item_types (
    id INTEGER PRIMARY KEY , -- unique identifier for each item type
    name TEXT -- name of the item type
);

INSERT INTO item_types (name) VALUES -- insert predefined item types into item_types table
    ('Raspberry Pi 3B'),
    ('Raspberry Pi 2'),
    ('Micro:Bit'),
    ('Arduno');

CREATE TABLE item_extensions (
    id INTEGER PRIMARY KEY , -- unique identifier for each item extension
    name TEXT -- name of the item extension
);

INSERT INTO item_extensions (name) VALUES -- insert predefined item extensions into item_extensions table
    ('Keyboard + mouse'),
    ('Bit:Bot'),
    ('Display'),
    ('Sense Hat'),
    ('PoE Hat');

CREATE TABLE extension_items (
    id INTEGER PRIMARY KEY , -- unique identifier for each extension item
    extension_id INTEGER, -- identifier for the item extension
    item_id INTEGER, -- identifier for the item
    amount INTEGER, -- amount of the extension item
    FOREIGN KEY (extension_id) REFERENCES item_extensions(id) ON DELETE CASCADE, -- enforce referential integrity to item_extensions table
    FOREIGN KEY (item_id) REFERENCES item_types(id) ON DELETE CASCADE -- enforce referential integrity to items table
);

CREATE TABLE requests (
    id INTEGER PRIMARY KEY , -- unique identifier for each request
    user INTEGER, -- identifier for the user who made the request
    approved_date TEXT, -- date when the request was approved
    duration TEXT, -- duration of the request
    status INTEGER, -- status of the request
    FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE, -- enforce referential integrity to users table
    FOREIGN KEY (status) REFERENCES request_status(id) ON DELETE CASCADE -- enforce referential integrity to request_status table
);

CREATE TABLE request_status (
    id INTEGER PRIMARY KEY , -- unique identifier for each request status
    name TEXT -- name of the request status
);

INSERT INTO request_status (name) VALUES -- insert predefined request statuses into request_status table
    ('pending'),
    ('approved'),
    ('denied'),
    ('returned');

CREATE TABLE requested_items (
    id INTEGER PRIMARY KEY , -- unique identifier for each requested item
    request_id INTEGER, -- identifier for the request
    item_id INTEGER, -- identifier for the item
    amount INTEGER, -- amount of the requested item
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE, -- enforce referential integrity to requests table
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE requested_extensions (
    id INTEGER PRIMARY KEY ,
    request_id INTEGER,
    extension_id INTEGER,
    amount INTEGER,
    FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE,
    FOREIGN KEY (extension_id) REFERENCES item_extensions(id) ON DELETE CASCADE
);

--- indexes (from ChatGPT)
CREATE INDEX idx_users_active ON users(active);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_items_type ON items(type);

CREATE INDEX idx_extension_items_extension_id ON extension_items(extension_id);
CREATE INDEX idx_extension_items_item_id ON extension_items(item_id);

CREATE INDEX idx_requests_user ON requests(user);
CREATE INDEX idx_requests_status ON requests(status);

CREATE INDEX idx_requested_items_request_id ON requested_items(request_id);
CREATE INDEX idx_requested_items_item_id ON requested_items(item_id);

CREATE INDEX idx_requested_extensions_request_id ON requested_extensions(request_id);
CREATE INDEX idx_requested_extensions_extension_id ON requested_extensions(extension_id);
