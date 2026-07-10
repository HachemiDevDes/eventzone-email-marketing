CREATE OR REPLACE FUNCTION process_dynamic_segmentation()
RETURNS TRIGGER AS $$
DECLARE
    list_rec RECORD;
BEGIN
    -- Loop through all dynamic lists that belong to the same user
    -- (We get user_id from the campaign's user_id)
    FOR list_rec IN 
        SELECT l.id, l.rule_definition 
        FROM lists l
        JOIN campaigns c ON c.user_id = l.user_id
        WHERE c.id = NEW.campaign_id AND l.type = 'dynamic'
    LOOP
        -- Simple rule evaluation: check if event_type matches the rule's required event_type
        -- Rule format: {"event_type": "click"} or {"event_type": "open", "campaign_id": "uuid"}
        
        IF (list_rec.rule_definition->>'event_type' = NEW.event_type::text) THEN
            -- Check if campaign_id is required
            IF (list_rec.rule_definition->>'campaign_id' IS NULL OR list_rec.rule_definition->>'campaign_id' = NEW.campaign_id::text) THEN
                
                -- Add to list_memberships ignoring if already exists
                INSERT INTO list_memberships (contact_id, list_id, join_method)
                VALUES (NEW.contact_id, list_rec.id, 'auto')
                ON CONFLICT (contact_id, list_id) DO NOTHING;
                
            END IF;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_event_inserted
AFTER INSERT ON events
FOR EACH ROW EXECUTE FUNCTION process_dynamic_segmentation();
