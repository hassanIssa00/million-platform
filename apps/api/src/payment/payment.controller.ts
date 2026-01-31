import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  @ApiOperation({ summary: 'Create Stripe Payment Intent' })
  async createIntent(@Body() body: { amount: number; currency?: string }) {
    const intent = await this.paymentService.createPaymentIntent(
      body.amount,
      body.currency,
    );
    return { clientSecret: intent.client_secret, id: intent.id };
  }

  @Post('invoices')
  @ApiOperation({ summary: 'Create a new invoice' })
  async createInvoice(
    @Request() req: any,
    @Body() body: { amount: number; description: string },
  ) {
    return this.paymentService.createInvoice(
      req.user.id,
      body.amount,
      body.description,
    );
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payment history' })
  async getHistory(@Request() req: any) {
    return this.paymentService.getStudentInvoices(req.user.id);
  }

  @Post('invoices/:id/confirm')
  @ApiOperation({ summary: 'Confirm invoice payment' })
  async confirmInvoice(
    @Param('id') id: string,
    @Body() body: { stripeId: string },
  ) {
    // In real world, this should be validated via Webhook, not client trust.
    // For demo/MVP, we allow client to say "I paid".
    return this.paymentService.updateInvoiceStatus(id, 'PAID', body.stripeId);
  }
}
