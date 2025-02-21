-- Create the tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample data
INSERT INTO
    tasks (title, description, is_completed)
VALUES
    ('Task 1', 'This is the first task', FALSE),
    ('Task 2', 'This is the second task', TRUE),
    ('Task 3', 'This is the third task', FALSE);