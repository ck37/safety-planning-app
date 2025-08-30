import { SafetyPlan, Contact } from '../SafetyPlan';

describe('SafetyPlan Types', () => {
  describe('Contact interface', () => {
    it('should allow contact with name only', () => {
      const contact: Contact = {
        name: 'John Doe'
      };
      
      expect(contact.name).toBe('John Doe');
      expect(contact.phone).toBeUndefined();
    });

    it('should allow contact with name and phone', () => {
      const contact: Contact = {
        name: 'Jane Smith',
        phone: '555-0123'
      };
      
      expect(contact.name).toBe('Jane Smith');
      expect(contact.phone).toBe('555-0123');
    });
  });

  describe('SafetyPlan interface', () => {
    it('should create a valid empty safety plan', () => {
      const safetyPlan: SafetyPlan = {
        warningSigns: [],
        copingStrategies: [],
        supportContacts: [],
        safePlaces: [],
        reasonsForLiving: []
      };

      expect(safetyPlan.warningSigns).toEqual([]);
      expect(safetyPlan.copingStrategies).toEqual([]);
      expect(safetyPlan.supportContacts).toEqual([]);
      expect(safetyPlan.safePlaces).toEqual([]);
      expect(safetyPlan.reasonsForLiving).toEqual([]);
    });

    it('should create a valid populated safety plan', () => {
      const safetyPlan: SafetyPlan = {
        warningSigns: ['Feeling isolated', 'Sleep problems'],
        copingStrategies: ['Deep breathing', 'Call a friend'],
        supportContacts: [
          { name: 'Dr. Smith', phone: '555-0123' },
          { name: 'Mom' }
        ],
        safePlaces: ['Library', 'Park'],
        reasonsForLiving: ['Family', 'Future goals']
      };

      expect(safetyPlan.warningSigns).toHaveLength(2);
      expect(safetyPlan.copingStrategies).toHaveLength(2);
      expect(safetyPlan.supportContacts).toHaveLength(2);
      expect(safetyPlan.safePlaces).toHaveLength(2);
      expect(safetyPlan.reasonsForLiving).toHaveLength(2);
      
      expect(safetyPlan.supportContacts[0].phone).toBe('555-0123');
      expect(safetyPlan.supportContacts[1].phone).toBeUndefined();
    });
  });
});
