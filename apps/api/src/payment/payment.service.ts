import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
      {
        // @ts-ignore
        apiVersion: '2024-12-18.acacia',
      },
    );
  }

  async createPaymentIntent(amount: number, currency: string = 'usd') {
    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency,
      automatic_payment_methods: { enabled: true },
    });
  }

  async createInvoice(studentId: string, amount: number, description: string) {
    return this.prisma.invoice.create({
      data: {
        studentId,
        amount,
        description,
        status: 'PENDING',
      },
    });
  }

  async updateInvoiceStatus(id: string, status: string, stripeId?: string) {
    return this.prisma.invoice.update({
      where: { id },
      data: { status, stripeId },
    });
  }

  async getStudentInvoices(studentId: string) {
    return this.prisma.invoice.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
