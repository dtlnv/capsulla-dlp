import cancelEvent from './cancel-event';

describe('cancelEvent', () => {
    let mockEvent: Event;

    beforeEach(() => {
        mockEvent = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            stopImmediatePropagation: jest.fn(),
        } as unknown as Event;
    });

    it('should call preventDefault on the event', () => {
        cancelEvent(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should call stopPropagation on the event', () => {
        cancelEvent(mockEvent);
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });

    it('should call stopImmediatePropagation on the event', () => {
        cancelEvent(mockEvent);
        expect(mockEvent.stopImmediatePropagation).toHaveBeenCalled();
    });

    it('should call all three methods exactly once', () => {
        cancelEvent(mockEvent);
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
        expect(mockEvent.stopPropagation).toHaveBeenCalledTimes(1);
        expect(mockEvent.stopImmediatePropagation).toHaveBeenCalledTimes(1);
    });
});
