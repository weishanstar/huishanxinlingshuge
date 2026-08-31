# kdp_revenue.py
from decimal import Decimal, ROUND_HALF_UP

def calculate_royalty(price: float, units_sold: int, royalty_rate: float) -> Decimal:
    """
    Calculate KDP royalty amount with proper decimal precision.
    
    Args:
        price: Book price in USD
        units_sold: Number of units sold
        royalty_rate: Royalty rate (e.g., 0.7 for 70%)
    
    Returns:
        Decimal: Royalty amount rounded to 2 decimal places
    """
    # Use Decimal for financial calculations to avoid floating-point errors
    price_decimal = Decimal(str(price))
    rate_decimal = Decimal(str(royalty_rate))
    units_decimal = Decimal(str(units_sold))
    
    # Calculate: price * units * rate
    gross_revenue = price_decimal * units_decimal
    royalty = gross_revenue * rate_decimal
    
    # Round to 2 decimal places (standard for currency)
    return royalty.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

# Example usage (for testing)
if __name__ == "__main__":
    # Test case: $9.99 book, 100 units sold, 70% royalty
    result = calculate_royalty(9.99, 100, 0.7)
    print(f"Royalty: ${result}")  # Expected: $699.30