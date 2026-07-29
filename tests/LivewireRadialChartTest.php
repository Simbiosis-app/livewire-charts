<?php

namespace Asantibanez\LivewireCharts\Tests;

use Asantibanez\LivewireCharts\Charts\LivewireRadialChart;
use Livewire\Features\SupportTesting\Testable;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\Test;

class LivewireRadialChartTest extends TestCase
{
    private function buildComponent() : Testable
    {
        return Livewire::test(LivewireRadialChart::class);
    }

    #[Test]
    public function can_build_component()
    {
        //Act
        $component = $this->buildComponent();

        //Assert
        $this->assertNotNull($component);
    }

    #[Test]
    public function should_emit_event_if_present()
    {
        //Arrange
        $component = $this->buildComponent();

        $radialChartModel = $component->radialChartModel;

        data_set($radialChartModel, 'onBarClickEventName', 'custom-event');

        $component->set('radialChartModel', $radialChartModel);

        //Act
        $component->runAction('onBarClick', []);

        //Assert
        $component->assertDispatched('custom-event');
    }
}
