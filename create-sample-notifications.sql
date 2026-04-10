-- Create sample notifications for testing
-- This script creates various types of notifications for the test user

-- Insert sample notifications for the test user
INSERT INTO public.notifications (user_id, type, title, message, data, read) VALUES
-- Welcome notification
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'welcome', 'Welcome to Rwanda Market!', 'Start exploring products and connect with suppliers across Rwanda.', '{}', false),

-- Message notification
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'message', 'New message from Supplier', 'You have received a new message about your inquiry.', '{"conversationId": "123"}', false),

-- Quote request notification
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'quote_request', 'Quote request received', 'A buyer has requested a quote for your product.', '{"listingId": "456"}', false),

-- Quote response notification
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'quote_response', 'Quote received from Supplier', 'Your requested quote is ready for review.', '{"quoteId": "789"}', false),

-- Listing update notification
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'listing_update', 'Product price updated', 'The price for Construction Materials has been updated.', '{"listingId": "101"}', true),

-- Price alert notification
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'price_alert', 'Price alert: Cement', 'Price changed to 25,000 RWF per bag.', '{"listingId": "102", "newPrice": 25000}', false),

-- System notification
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'system', 'Platform maintenance scheduled', 'The platform will undergo maintenance on Sunday from 2-4 AM.', '{"maintenanceDate": "2024-04-14"}', false),

-- Verification notification
('e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1', 'verification', 'Account verification approved', 'Your supplier account has been verified successfully.', '{}', true);

-- Check the inserted notifications
SELECT 
    type,
    title,
    message,
    read,
    created_at
FROM public.notifications 
WHERE user_id = 'e874ddb0-cd47-41c8-aaff-c2cd9aaed7a1'
ORDER BY created_at DESC;