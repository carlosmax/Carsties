using AuctionService.Entities;

namespace AuctionService.UnitTests;

public class AuctionEntityTests
{
    [Fact]
    public void HasReservePrice_GreaterThenZero_True() //Method_Scenario_Result
    {
        // arrange
        var action = new Auction { Id = Guid.NewGuid(), ReservePrice = 10 };

        // act
        var result = action.HasReservePrice();

        // assert
        Assert.True(result);
    }

    [Fact]
    public void HasReservePrice_IsZero_False() //Method_Scenario_Result
    {
        // arrange
        var action = new Auction { Id = Guid.NewGuid(), ReservePrice = 0 };

        // act
        var result = action.HasReservePrice();

        // assert
        Assert.False(result);
    }
}